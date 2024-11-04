'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSongs } from '@/services/songService';
import SongCard from '../SongCard';
import { Button } from '../ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { ChevronDown } from 'lucide-react';
import { useSongActions } from '@/hooks/useSongActions';

interface SearchResultsProps {
  query: string;
  onClearSearch: () => void;
}

export default function SearchResults({ query, onClearSearch }: SearchResultsProps) {
  const {
    handleOptimisticLike,
    handleDelete,
    handleEdit,
    handleSaveToggle,
    checkIsLiked,
    checkIsSaved,
    user } = useSongActions();
  const { language } = useLanguage();
  const t = translations[language];
  const [page, setPage] = useState(1);

  const handleClearSearch = () => {
    onClearSearch();
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['songs', 'search', query, page],
    queryFn: async () => {
      const response = await searchSongs(query, page);
      return response;
    },
    enabled: !!query,
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.searchResults}</h2>
        <Button variant="outline" onClick={handleClearSearch}>{t.clearSearch}</Button>
      </div>

      {isLoading && page === 1 ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.songs?.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                // stats={{
                //   viewCount: song.viewCount || 0,
                //   likeCount: song.songLikes?.length || 0,
                //   commentCount: song.commentCount || 0
                // }}
                onLike={() => handleOptimisticLike(song, 'songs/search')}
                onSave={() => handleSaveToggle(song, 'songs/search')}
                isLiked={checkIsLiked(song)}
                isSaved={checkIsSaved(song)}
                canManage={user?.id === song.userId || user?.userType === 'admin'}
                onEdit={() => handleEdit(song.id)}
                onDelete={() => handleDelete(song.id)}
                isLoggedIn={user?.id ? true : false}
                userData={user || undefined}
              />
            ))}
          </div>

          {data?.pagination?.hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : t.loadMore}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && (!data?.songs || data.songs.length === 0) && (
        <div className="text-center text-gray-500">No results found</div>
      )}
    </section>
  );
}