import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toggleLikeSong, deleteSong, saveSong, unsaveSong, Song } from '@/services/songService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '@/services/userService';

export const useSongActions = () => {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleOptimisticLike = async (song: any, queryKey: string) => {
        if (isLoading) return;
        setIsLoading(true);

        if (!user) {
            toast.error('Please login to like songs');
            setIsLoading(false);
            return;
        }

        const isLiked = song.songLikes?.some((like: any) => like.userId === user?.id) || false;

        // Optimistically update the UI
        queryClient.setQueryData([queryKey], (oldData: any) => {
            return oldData?.map((s: any) => {
                if (s.id === song.id) {
                    const updatedLikes = isLiked
                        ? s.songLikes.filter((like: any) => like.userId !== user?.id)
                        : [...(s.songLikes || []), { userId: user.id }];

                    return {
                        ...s,
                        songLikes: updatedLikes,
                    };
                }
                return s;
            });
        });

        try {
            await toggleLikeSong(song.id, isLiked);

            // Only invalidate other related queries
            await queryClient.invalidateQueries({ queryKey: ['songs', song.id] });

            toast.success(isLiked ? 'Song unliked' : 'Song liked');
        } catch (error) {
            // Revert the optimistic update on error
            queryClient.setQueryData([queryKey], (oldData: any) => {
                return oldData?.map((s: any) => {
                    if (s.id === song.id) {
                        const revertedLikes = !isLiked
                            ? s.songLikes.filter((like: any) => like.userId !== user?.id)
                            : [...(s.songLikes || []), { userId: user.id }];

                        return {
                            ...s,
                            songLikes: revertedLikes,
                        };
                    }
                    return s;
                });
            });
            toast.error('Failed to update like');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (songId: string) => {
        if (!user) {
            toast.error('Please login to delete songs');
            return;
        }

        try {
            await deleteSong(songId);
            await queryClient.invalidateQueries({ queryKey: ['songs'] });
            toast.success('Song deleted successfully');
            await router.refresh();
        } catch (error) {
            toast.error('Failed to delete song');
        }
    };

    const handleEdit = (songId: string) => {
        router.push(`/chordpro-editor?songId=${songId}`);
    };

    const checkIsLiked = (song: Song) => {
        return song.songLikes?.some((like) => like.userId === user?.id) || false;
    }

    const checkIsSaved = (song: Song) => {
        return (
            song.savedSongs?.some(save => {
                return save.songId === song.id
                    && save.userId === user?.id;
            }) || false
        );
    }

    const handleSaveToggle = async (song: any, queryKey: string) => {
        if (isLoading) return;
        setIsLoading(true);

        if (!user) {
            toast.error('Please login to save songs');
            setIsLoading(false);
            return;
        }

        const isSaved = song.savedSongs?.some(
            (save: any) => save.songId === song.id && save.userId === user?.id
        ) || false;

        // Optimistically update the UI
        queryClient.setQueryData([queryKey], (oldData: any) => {
            return oldData?.map((s: any) => {
                if (s.id === song.id) {
                    const updatedSaves = isSaved
                        ? s.savedSongs.filter((save: any) => save.userId !== user?.id)
                        : [...(s.savedSongs || []), { userId: user.id, songId: song.id }];
                    return {
                        ...s,
                        savedSongs: updatedSaves,
                    };
                }
                return s;
            });
        });

        try {
            if (isSaved) {
                await unsaveSong(song.id);
            } else {
                await saveSong(song.id);
            }

            // Invalidate related queries
            await queryClient.invalidateQueries({ queryKey: ['songs', song.id] });
            await queryClient.invalidateQueries({ queryKey: ['most-liked-songs'] });
            await queryClient.invalidateQueries({ queryKey: ['most-viewed-songs'] });
            await queryClient.invalidateQueries({ queryKey: ['popular-songs'] });
            toast.success(isSaved ? 'Song unsaved' : 'Song saved');
        } catch (error) {
            // Revert the optimistic update on error
            queryClient.setQueryData([queryKey], (oldData: any) => {
                return oldData?.map((s: any) => {
                    if (s.id === song.id) {
                        const revertedSaves = !isSaved
                            ? s.savedSongs.filter((save: any) => save.userId !== user?.id)
                            : [...(s.savedSongs || []), { userId: user.id, songId: song.id }];
                        return {
                            ...s,
                            savedSongs: revertedSaves,
                        };
                    }
                    return s;
                });
            });
            toast.error('Failed to save/unsave song');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleOptimisticLike,
        handleDelete,
        handleEdit,
        handleSaveToggle,
        checkIsLiked,
        checkIsSaved,
        user,
        isLoading
    };
}; 