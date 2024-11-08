'use client';

import React, { Suspense, use, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getSongById } from '@/services/songService';
import { notFound } from 'next/navigation';
import RenderedSong from './RenderedSong';
import ControlBar from './ControlBar';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Create a QueryClient instance outside of the component to avoid recreating it on every render
const queryClient = new QueryClient();

function SongContent({ id }: { id: string }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(14);
  const [transpose, setTranspose] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0.5); // Default speed is 0.5x
  const scrollIntervalRef = useRef<NodeJS.Timeout>();
  const [delayAmount, setDelayAmount] = useState(70);


  const { data: song, isLoading, error } = useQuery({
    queryKey: ['song', id],
    queryFn: () => getSongById(id),
  });

  const handleFontIncrease = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const handleFontDecrease = () => {
    setFontSize(prev => Math.max(prev - 2, 8));
  };

  const handleTransposeUp = () => {
    setTranspose(prev => prev + 1);
  };

  const handleTransposeDown = () => {
    setTranspose(prev => prev - 1);
  };

  const getScrollAmount = () => {
    // Adjust base amount and add minimum scroll amount
    const baseScrollAmount = 0.5; // Decreased initial base amount
    const minScrollAmount = 0.05; // Minimum scroll amount
    const scrollAmountMultiplier = 10; // Multiplier
    return Math.max(baseScrollAmount * scrollSpeed * scrollAmountMultiplier, minScrollAmount);
  };

  const handleAutoScroll = () => {
    const newIsScrolling = !isScrolling;
    setIsScrolling(newIsScrolling);

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = undefined;
    }

    if (newIsScrolling && previewRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (previewRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = previewRef.current;
          const isAtBottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) < 1; // Check for near-bottom

          if (!isAtBottom) {
            previewRef.current.scrollTop += 1;
          } else {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = undefined;
            setIsScrolling(false);
          }
        }
      }, delayAmount);
    }
  };

  const handleSpeedIncrease = () => {
    setIsScrolling(true);
    setScrollSpeed(prev => {
      const newSpeed = Math.min(Math.round((prev + 0.1) * 10) / 10, 1.5);
      return newSpeed;
    });
    setDelayAmount(delayAmount - 10);
  };

  const handleSpeedDecrease = () => {
    setIsScrolling(true);
    setScrollSpeed(prev => {
      const newSpeed = Math.max(Math.round((prev - 0.1) * 10) / 10, 0.1);
      return newSpeed;
    });
    setDelayAmount(delayAmount + 10);
  };

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isScrolling) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }

      if (previewRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          if (previewRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = previewRef.current;

            const isAtBottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) < 1;

            if (!isAtBottom) {
              previewRef.current.scrollTop += 1;
            } else {
              clearInterval(scrollIntervalRef.current);
              scrollIntervalRef.current = undefined;
              setIsScrolling(false);
            }
          }
        }, delayAmount);
      }
    }
  }, [scrollSpeed, isScrolling]);

  if (isLoading) return (
    <div
      className="container mx-auto p-4"
    >
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      Error: {(error as Error).message}
    </div>
  );

  if (!song) return notFound();

  return (
    <div className="song-container">
      <div
        ref={previewRef}
        className="overflow-y-auto scrollbar-hide"
      >
        <RenderedSong
          songData={song}
          transposeNumber={transpose}
          fontSizeNumber={fontSize}
        />

      </div>
      <div className="border-t sticky bottom-0 bg-white dark:bg-gray-800 rounded-b-lg">
        <ControlBar
          onFontDecrease={handleFontDecrease}
          onFontIncrease={handleFontIncrease}
          onTransposeDown={handleTransposeDown}
          onTransposeUp={handleTransposeUp}
          onAutoScroll={handleAutoScroll}
          onSpeedDecrease={handleSpeedDecrease}
          onSpeedIncrease={handleSpeedIncrease}
          isScrolling={isScrolling}
          scrollSpeed={scrollSpeed}
          transpose={transpose}
        />
      </div>
    </div>
  );
}

export default function SongPage({ params }: PageProps) {
  // Use `React.use()` to resolve the Promise for params
  const { id } = use(params);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <SongContent id={id} />
      </Suspense>
    </QueryClientProvider>
  );
}
