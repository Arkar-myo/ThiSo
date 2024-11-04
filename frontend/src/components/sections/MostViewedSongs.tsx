'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMostViewedSongs } from '@/services/songService';
import SongCard from '../SongCard';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSongActions } from '@/hooks/useSongActions';

export default function MostViewedSongs() {
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

    const { data: songs, isLoading, error } = useQuery({
        queryKey: ['most-viewed-songs'],
        queryFn: getMostViewedSongs,
    });

    if (isLoading) {
        return (
            <section className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </section>
        );
    }

    if (error) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t.mostViewedSongs}</h2>
                <div className="flex gap-2">
                    <button className="swiper-button-prev-viewed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="swiper-button-next-viewed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{
                    nextEl: '.swiper-button-next-viewed',
                    prevEl: '.swiper-button-prev-viewed',
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination-viewed',
                    bulletClass: 'swiper-pagination-bullet-viewed',
                    bulletActiveClass: 'swiper-pagination-bullet-active-viewed',
                }}
                autoplay={{
                    delay: 3000,
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
                {songs?.map((song) => (
                    <SwiperSlide key={song.id} className="transition-transform duration-300 hover:scale-[1.02]">
                        <SongCard
                            song={song}
                            // stats={{
                            //     viewCount: song.viewCount || 0,
                            //     likeCount: song.songLikes?.length || 0,
                            //     commentCount: song.commentCount || 0
                            // }}
                            onLike={() => handleOptimisticLike(song, 'most-viewed-songs')}
                            onSave={() => handleSaveToggle(song, 'most-viewed-songs')}
                            isLiked={checkIsLiked(song)}
                            isSaved={checkIsSaved(song)}
                            canManage={user?.id === song.userId || user?.userType === 'admin'}
                            onEdit={() => handleEdit(song.id)}
                            onDelete={() => handleDelete(song.id)}
                            isLoggedIn={user?.id ? true : false}
                            userData={user || undefined}
                        />
                    </SwiperSlide>
                ))}
                <div className="swiper-pagination-viewed mt-4"></div>
            </Swiper>
        </section>
    );
} 