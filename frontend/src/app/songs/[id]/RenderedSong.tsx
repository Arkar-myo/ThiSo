import { renderThiSo } from '@/app/chordpro-editor/ChordServices';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import ControlBar from '@/app/songs/[id]/ControlBar';
import type { Song } from '@/services/songService';
import SongActions from '@/components/SongActions';
import { useQueryClient } from '@tanstack/react-query';
import { saveSong, toggleLikeSong, unsaveSong } from '@/services/songService';
import { toast } from 'sonner';
import { useSongActions } from '@/hooks/useSongActions';

interface RenderedSongProps {
  songData: Song;
  stats?: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  onLike?: () => void;
  isLiked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
}

const RenderedSong: React.FC<RenderedSongProps> = ({
  songData
}) => {
  const { handleDelete, handleEdit, user } = useSongActions();
  const queryClient = useQueryClient();
  const previewRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(14);
  const [transpose, setTranspose] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0.5); // Default speed is 0.5x
  const scrollIntervalRef = useRef<NodeJS.Timeout>();
  // const { user, isLoading } = useAuth()

  // Add state for tracking likes locally
  const [localSongData, setLocalSongData] = useState(songData);

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error('Please login to save songs');
      return;
    }

    try {
      const isSaved = localSongData.savedSongs?.some((eachSave) => eachSave.songId === localSongData.id
        && eachSave.userId === user.id);

      if (isSaved) {
        await unsaveSong(localSongData.id); // Call the delete saved song API
        toast.success('Song unsaved successfully');
      } else {
        await saveSong(localSongData.id); // Call the save song API
        toast.success('Song saved successfully');
      }
      // setIsSaved(!isSaved); // Toggle the saved state
    } catch (error) {
      toast.error('Failed to save/unsave song');
    } finally {
      // setIsSubmitting(false);
    }
  };

  // Custom like handler for RenderedSong
  const handleSongLike = async () => {
    if (!user) {
      toast.error('Please login to like songs');
      return;
    }

    try {
      const isLiked = localSongData.songLikes?.some(like => like.userId === user?.id) || false;
      await toggleLikeSong(localSongData.id, isLiked);

      // Update local state immediately for UI response
      setLocalSongData(prev => {
        if (isLiked) {
          // Remove like
          return {
            ...prev,
            songLikes: prev.songLikes?.filter(like => like.userId !== user?.id) || []
          };
        } else {
          // Add like
          return {
            ...prev,
            songLikes: [...(prev.songLikes || []), { userId: user.id }]
          };
        }
      });

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: ['songs', songData.id] });
      await queryClient.invalidateQueries({ queryKey: ['most-liked-songs'] });
      await queryClient.invalidateQueries({ queryKey: ['popular-songs'] });

      toast.success(isLiked ? 'Song unliked' : 'Song liked');
    } catch (error) {
      // Revert local state on error
      setLocalSongData(songData);
      toast.error('Failed to update like');
    }
  };

  // Update local state when songData prop changes
  useEffect(() => {
    setLocalSongData(songData);
  }, [songData]);

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
    const baseScrollAmount = 0.5; // Increased base amount
    const minScrollAmount = 0.01; // Decreased minimum scroll amount
    const scrollAmountMultiplier = 5; // Increased multiplier
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
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;

          if (!isAtBottom) {
            const scrollAmount = getScrollAmount();
            previewRef.current.scrollTop += scrollAmount;
          } else {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = undefined;
            setIsScrolling(false);
          }
        }
      }, 16);
    }
  };

  const handleSpeedIncrease = () => {
    setScrollSpeed(prev => {
      const newSpeed = Math.min(Math.round((prev + 0.1) * 10) / 10, 1.5);
      return newSpeed;
    });
  };

  const handleSpeedDecrease = () => {
    setScrollSpeed(prev => {
      const newSpeed = Math.max(Math.round((prev - 0.1) * 10) / 10, 0.1);
      return newSpeed;
    });
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

            if (scrollTop + clientHeight < scrollHeight) {
              const scrollAmount = getScrollAmount();
              previewRef.current.scrollTop += scrollAmount;
            } else {
              clearInterval(scrollIntervalRef.current);
              scrollIntervalRef.current = undefined;
              setIsScrolling(false);
            }
          }
        }, 50);
      }
    }
  }, [scrollSpeed, isScrolling]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col pt-16 sm:pt-20 lg:pt-24 pb-2 sm:pb-6 h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-lg flex-1">
          {/* Scrollable Content Section */}
          <div
            ref={previewRef}
            className="overflow-y-auto"
            style={{
              height: 'calc(100vh - 140px)',
            }}
          >
            {/* Header Section - Regular div, not sticky */}
            <div className="border-b p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold break-words">
                    {songData.title}
                  </h1>
                  <div className="space-y-0.5">
                    <p className="text-sm text-muted-foreground">by {songData.singer}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Key: {songData.key || "-"}</span>
                      <span>•</span>
                      <span>Tempo: {songData.tempo || "-"}</span>
                    </div>
                  </div>
                </div>

                <SongActions
                  songData={localSongData}
                  onLike={handleSongLike}
                  onSave={() => handleSaveToggle()}
                  isLiked={localSongData.songLikes?.some((like) => like.userId === user?.id) || false}
                  isSaved={localSongData.savedSongs?.some((eachSave) =>
                    eachSave.songId === localSongData.id && eachSave.userId === user?.id)}
                  onEdit={() => handleEdit(localSongData.id)}
                  onDelete={() => handleDelete(localSongData.id)}
                  canManage={user?.id === localSongData.userId || user?.userType === 'admin'}
                  isLoggedIn={user?.id ? true : false}
                  onSaveInclude={true}
                  userData={user || undefined}
                />
              </div>
            </div>

            {/* Song Content */}
            <div className="p-4 sm:p-6">
              {useMemo(() => {
                const { renderedLines } = renderThiSo({
                  text: songData.body,
                  transpose: transpose,

                });
                return (
                  <div
                    className="font-mono whitespace-pre-wrap"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: '1.8'
                    }}
                  >
                    {renderedLines}
                  </div>
                );
              }, [songData.body, transpose, fontSize])}
            </div>
          </div>

          {/* Control Bar */}
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
      </div>
    </div>
  );
};

export default RenderedSong;
