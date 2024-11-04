'use client';

import React from 'react';
import SearchResults from './SearchResults';
import PopularSongs from './PopularSongs';
import MostLikedSongs from './MostLikedSongs';
import MostViewedSongs from './MostViewedSongs';
import FeaturedArtists from './FeaturedArtists';
import SearchBar from '@/components/SearchBar';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SongListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/song-list?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClearSearch = () => {
    router.push('/song-list');
  };

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 space-y-16">
      <SearchBar 
        onSearch={handleSearch} 
        initialQuery={query}
        className="mb-8 max-w-2xl mx-auto"
      />
      {query && <SearchResults query={query} onClearSearch={handleClearSearch} />}
      <PopularSongs />
      <MostViewedSongs />
      <MostLikedSongs />
      <FeaturedArtists />
    </div>
  );
}
