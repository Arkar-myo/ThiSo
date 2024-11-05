'use client';

import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getSongById } from '@/services/songService';
import { notFound } from 'next/navigation';
import RenderedSong from '@/components/RenderedSong';

// Define a type that includes params as a Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function SongContent({ id }: { id: string }) {
  const { data: song, isLoading, error } = useQuery({
    queryKey: ['song', id],
    queryFn: () => getSongById(id),
  });

  if (isLoading) return (
    <div className="container mx-auto p-4">
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
      <RenderedSong songData={song} />
    </div>
  );
}

export default async function SongPage({ params }: PageProps) {
  // Await the resolved params to ensure it is treated as non-Promise
  const { id } = await params;

  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <SongContent id={id} />
      </Suspense>
    </QueryClientProvider>
  );
}
