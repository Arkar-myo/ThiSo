'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPopularSongs, toggleLikeSong, deleteSong, Song } from '@/services/songService';
import SongCard from '../SongCard';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSongActions } from '@/hooks/useSongActions';

export default function PopularSongs() {
  const {
    handleOptimisticLike,
    handleDelete, handleEdit,
    handleSaveToggle,
    checkIsLiked,
    checkIsSaved,
    user } = useSongActions();
  const { language } = useLanguage();
  const t = translations[language];

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ['popular-songs'],
    queryFn: getPopularSongs,
  });

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </section>
    );
  }

  if (error) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.popularSongs}</h2>
        <div className="flex gap-2">
          <button className="swiper-button-prev-popular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="swiper-button-next-popular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next-popular',
          prevEl: '.swiper-button-prev-popular',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-popular',
          bulletClass: 'swiper-pagination-bullet-popular',
          bulletActiveClass: 'swiper-pagination-bullet-active-popular',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={20}
        breakpoints={{
          370: { slidesPerView: 4 },
          640: { slidesPerView: 4 },
          768: { slidesPerView: 6 },
          1024: { slidesPerView: 6 },
        }}
        className="song-swiper !overflow-visible"
      >
        {songs?.map((song) => {
          // const isLiked = song.songLikes?.some((like) => like.userId === user?.id) || false;
          // const isSaved = Array.isArray(song.savedSongs) && song.savedSongs.length > 0
          //   ? song.savedSongs.some(save => {
          //     return save.songId === song.id && save.userId === user?.id;
          //   })
          //   : false;


          return (<SwiperSlide key={song.id} className="transition-transform duration-300 hover:scale-[1.02]">
            <SongCard
              song={song}
              // stats={{
              //   viewCount: song.viewCount || 0,
              //   likeCount: song.songLikes?.length || 0,
              //   commentCount: song.commentCount || 0
              // }}
              onLike={() => handleOptimisticLike(song, 'popular-songs')}
              onSave={() => handleSaveToggle(song, 'popular-songs')}
              isLiked={checkIsLiked(song)}
              // isSaved={song.savedSongs?.some((eachSave) => eachSave.songId === song.id && eachSave.userId === user?.id)}
              // isSaved={song.savedSongs?.some((eachSave) => eachSave.songId === song.id 
              //   && eachSave.userId === user?.id) || false}
              isSaved={checkIsSaved(song)}
              canManage={user?.id === song.userId || user?.userType === 'admin'}
              onEdit={() => handleEdit(song.id)}
              onDelete={() => handleDelete(song.id)}
              isLoggedIn={user?.id ? true : false}
              userData={user || undefined}
            />
          </SwiperSlide>)
        })}
        <div className="swiper-pagination-popular mt-4"></div>
      </Swiper>
    </section>
  );
} 