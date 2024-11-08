import { renderThiSo } from '@/app/chordpro-editor/ChordServices';
import React, { useState, useEffect, useMemo } from 'react';
import type { Song } from '@/services/songService';
import SongActions from '@/components/SongActions';
// import { toast } from 'sonner';
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
  transposeNumber: number;
  fontSizeNumber: number;
}

const RenderedSong: React.FC<RenderedSongProps> = ({
  songData,
  transposeNumber,
  fontSizeNumber,
}) => {
  const { 
    handleDelete, 
    handleEdit, 
    handleOptimisticLike, 
    handleSaveToggle, 
    checkIsLiked,
    checkIsSaved,
    user } = useSongActions();
  // const queryClient = useQueryClient();

  
  // Add state for tracking likes locally
  const [localSongData, setLocalSongData] = useState(songData);

  // const handleSaveToggle1 = async () => {
  //   if (!user) {
  //     toast.error('Please login to save songs');
  //     return;
  //   }

  //   try {
  //     const isSaved = checkIsSaved(localSongData);
  //     if (isSaved) {
  //       await unsaveSong(localSongData.id); // Call the delete saved song API
  //       setLocalSongData(prev => {
  //         return {
  //           ...prev,
  //           savedSongs: [...(prev.savedSongs || []), { userId: user.id, songId: localSongData.id }]
  //         };
  //       })
  //       console.log('check localSongData==> ', localSongData)
  //       toast.success('Song unsaved successfully');
  //     } else {
  //       await saveSong(localSongData.id); // Call the save song API
  //       setLocalSongData(prev => {
  //         return {
  //           ...prev,
  //           savedSongs: prev.savedSongs?.filter(eachSave => eachSave.userId !== user?.id) || []
  //         };
  //       })
  //       console.log('check localSongData==> ', localSongData)
  //       toast.success('Song saved successfully');
  //     }
  //     // await queryClient.invalidateQueries({ queryKey: ['song', localSongData.id] });

  //   } catch (error) {
  //     toast.error('Failed to save/unsave song');
  //   } finally {
  //   }
  // };

  // // Custom like handler for RenderedSong
  // const handleSongLike = async () => {
  //   if (!user) {
  //     toast.error('Please login to like songs');
  //     return;
  //   }

  //   try {
  //     const isLiked = songData.songLikes?.some(like => like.userId === user?.id) || false;
  //     await toggleLikeSong(localSongData.id, isLiked);

  //     // Update local state immediately for UI response
  //     setLocalSongData(prev => {
  //       if (isLiked) {
  //         // Remove like
  //         return {
  //           ...prev,
  //           songLikes: prev.songLikes?.filter(like => like.userId !== user?.id) || []
  //         };
  //       } else {
  //         // Add like
  //         return {
  //           ...prev,
  //           songLikes: [...(prev.songLikes || []), { userId: user.id }]
  //         };
  //       }
  //     });

  //     // Invalidate queries
  //     // await queryClient.invalidateQueries({ queryKey: ['song', songData.id] });

  //     toast.success(isLiked ? 'Song unliked' : 'Song liked');
  //   } catch (error) {
  //     // Revert local state on error
  //     setLocalSongData(songData);
  //     toast.error('Failed to update like');
  //   }
  // };

  // Update local state when songData prop changes
  
  // const handleSongLike = async () => {
  //   if (!user) {
  //     toast.error('Please login to like songs');
  //     return;
  //   }
  
  //   try {
  //     const isLiked = localSongData.songLikes?.some(like => like.userId === user?.id) || false;
  //     const updatedSongData = await toggleLikeSong(localSongData.id, isLiked);
  
  //     // Update local state immediately for UI response
  //     setLocalSongData(updatedSongData);
  
  //     toast.success(isLiked ? 'Song unliked' : 'Song liked');
  //   } catch (error) {
  //     // Revert local state on error
  //     setLocalSongData(localSongData);
  //     toast.error('Failed to update like');
  //   }
  // };
  
  // // Custom save/unsave handler for RenderedSong
  // const handleSaveToggle1 = async () => {
  //   if (!user) {
  //     toast.error('Please login to save songs');
  //     return;
  //   }
  
  //   try {
  //     const isSaved = checkIsSaved(localSongData);
  //     const updatedSongData = isSaved
  //       ? await unsaveSong(localSongData.id)
  //       : await saveSong(localSongData.id);
  //     console.log(updatedSongData)
  
  //     // Update local state immediately for UI response
  //     setLocalSongData(updatedSongData);
  
  //     toast.success(isSaved ? 'Song unsaved successfully' : 'Song saved successfully');
  //   } catch (error) {
  //     // Revert local state on error
  //     setLocalSongData(localSongData);
  //     toast.error('Failed to save/unsave song');
  //   }
  // };
  useEffect(() => {
    setLocalSongData(songData);
  }, [localSongData, songData]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col pt-16 sm:pt-20 lg:pt-24 pb-2 sm:pb-6 h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-lg flex-1">
          {/* Scrollable Content Section */}
          <div
            style={{
              paddingBottom: '65px'
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
                    <p className="text-sm text-muted-foreground">Viewed: {songData.viewCount}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Key: {songData.key || "-"}</span>
                      <span>•</span>
                      <span>Tempo: {songData.tempo || "-"}</span>
                    </div>
                  </div>
                </div>

                <SongActions
                  songData={localSongData}
                  onLike={() => handleOptimisticLike(localSongData, 'song')}
                  onSave={()=> handleSaveToggle(localSongData, 'song')}
                  isLiked={checkIsLiked(localSongData) || false}
                  isSaved={checkIsSaved(localSongData)}
                  onEdit={() => handleEdit(localSongData.id)}
                  onDelete={() => handleDelete(localSongData.id)}
                  canManage={user?.id === localSongData.userId || user?.userType === 'admin'}
                  isLoggedIn={user?.id ? true : false}
                  onSaveInclude={true}
                  userData={user || undefined}
                  viewCountInclude={false}
                />
              </div>
            </div>

            {/* Song Content */}
            <div className="p-4 sm:p-6">
              {useMemo(() => {
                const { renderedLines } = renderThiSo({
                  text: songData.body,
                  transpose: transposeNumber,

                });
                return (
                  <div
                    className="font-mono whitespace-pre-wrap"
                    style={{
                      fontSize: `${fontSizeNumber}px`,
                      lineHeight: '1.8'
                    }}
                  >
                    {renderedLines}
                  </div>
                );
              }, [songData.body, transposeNumber, fontSizeNumber])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderedSong;
