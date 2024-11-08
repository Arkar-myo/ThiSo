'use client'

import React, { useState } from 'react';
import { Bookmark, Heart, Loader2, MoreHorizontal } from 'lucide-react';
import { Song } from '@/services/songService';
import { Button } from './ui/button';

import SongActions from './SongActions';
import { useRouter } from 'next/navigation';
import { User } from '@/services/userService';

interface SongCardProps {
  song: Song;
  // stats: SongStats;
  onLike: () => void;
  isLiked: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
  isLoggedIn?: boolean;
  onSave: () => void;
  isSaved?: boolean;
  userData?: User;
}

export default function SongCard({
  song,
  // stats,
  onLike,
  isLiked,
  onEdit,
  onDelete,
  canManage,
  isLoggedIn,
  onSave,
  isSaved,
  userData,

}: SongCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsNavigating(true);
    router.push(`/songs/${song.id}`);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-shadow p-4
      ${isNavigating ? 'pointer-events-none opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={handleClick}
            disabled={isNavigating}
            className="text-left w-full"
          >

            <h3 className="text-lg font-semibold hover:text-primary transition-colors w-48 truncate">
              {song.title}
            </h3>
          </button>
          <p className="text-sm text-muted-foreground">{song.singer}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="space-x-2"
          onClick={() => onSave()}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-yellow-500' : ''}`} />
        </Button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <SongActions
          songData={song}
          onLike={onLike}
          onSave={onSave}
          isLiked={isLiked}
          onEdit={onEdit}
          onDelete={onDelete}
          canManage={canManage}
          disabled={isNavigating}
          isLoggedIn={isLoggedIn}
          isSaved={isSaved}
          userData={userData}
        />
      </div>
      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 overflow-hidden">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );

} 