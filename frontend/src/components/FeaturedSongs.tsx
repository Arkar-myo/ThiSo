'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getFeaturedSongs, toggleLikeSong } from '@/services/songService'
import SongCard from './SongCard'
import { Skeleton } from './ui/skeleton'
import { useSongActions } from '@/hooks/useSongActions'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export default function FeaturedSongs() {
  const { handleDelete, handleEdit, handleSaveToggle, user } = useSongActions();
  const { language } = useLanguage()
  const t = translations[language]
  const queryClient = useQueryClient();

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ['featured-songs'],
    queryFn: getFeaturedSongs,
  })

  // Custom like handler for featured songs
  const handleLike = async (song: any) => {
    if (!user) {
      toast.error('Please login to like songs');
      return;
    }

    const isLiked = song.songLikes?.some((like: any) => like.userId === user?.id) || false;

    // Optimistically update the UI immediately
    queryClient.setQueryData(['featured-songs'], (oldData: any) => {
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
      // Make API call in the background
      await toggleLikeSong(song.id, isLiked);

      // Only invalidate other related queries
      await queryClient.invalidateQueries({ queryKey: ['songs', song.id] });
      await queryClient.invalidateQueries({ queryKey: ['most-liked-songs'] });
      await queryClient.invalidateQueries({ queryKey: ['popular-songs'] });

      toast.success(isLiked ? 'Song unliked' : 'Song liked');
    } catch (error) {
      // Revert the optimistic update on error
      queryClient.setQueryData(['featured-songs'], (oldData: any) => {
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
    }
  };

  if (isLoading) {
    return (
      <section className="bg-primary/5 py-20">
        <div className="container px-4 mx-auto">
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 space-y-4 shadow-md">
                  <Skeleton className="h-48 w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-primary/5 container px-4 mx-auto">
        <div className="text-center text-red-500">
          {t.failedToLoadSongs}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-primary/5 from-background to-muted/30 py-20">
      <div className="container px-4 mx-auto">
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t.featuredSongs}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t.featuredSongsDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {songs?.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                // stats={{
                //   viewCount: song.viewCount || 0,
                //   likeCount: song.songLikes?.length || 0,
                //   commentCount: song.commentCount || 0
                // }}
                onLike={() => handleLike(song)}
                onSave={() => handleSaveToggle(
                  (song.savedSongs?.some((eachSave) => eachSave.songId === song.id && eachSave.userId === user?.id)),
                  song.id
                )}
                isLiked={song.songLikes?.some((like) => like.userId === user?.id) || false}
                isSaved={song.savedSongs?.some((eachSave) => eachSave.songId === song.id
                  && eachSave.userId === user?.id) || false}
                canManage={user?.id === song.userId || user?.userType === 'admin'}
                isLoggedIn={user?.id ? true : false}
                onEdit={() => handleEdit(song.id)}
                onDelete={() => handleDelete(song.id)}
                userData={user || undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
