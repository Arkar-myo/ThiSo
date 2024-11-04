'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedArtists } from '@/services/songService';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedArtists() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  
  const { data: artists, isLoading, error } = useQuery({
    queryKey: ['featured-artists'],
    queryFn: getFeaturedArtists,
  });

  const handleArtistClick = (artistName: string) => {
    router.push(`/song-list?q=${encodeURIComponent(artistName)}`);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </section>
    );
  }

  if (error) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.featuredArtists}</h2>
        <div className="flex gap-2">
          <button className="swiper-button-prev-artists">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button className="swiper-button-next-artists">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next-artists',
          prevEl: '.swiper-button-prev-artists',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-artists',
          bulletClass: 'swiper-pagination-bullet-artists',
          bulletActiveClass: 'swiper-pagination-bullet-active-artists',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        loop={true}
        breakpoints={{
          370: { slidesPerView: 4 },
          640: { slidesPerView: 4 },
          768: { slidesPerView: 6 },
          1024: { slidesPerView: 6 },
        }}
        className="song-swiper !overflow-visible"
      >
        {artists?.map((artist) => (
          <SwiperSlide key={artist.id} className="transition-transform duration-300 hover:scale-[1.02]">
            <Card
              className="p-6 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleArtistClick(artist.name)}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold hover:text-primary transition-colors w-48 truncate">
                  {artist.name}
                  </h3>
                <p className="text-sm text-muted-foreground">
                  {artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}
                </p>
              </div>
            </Card>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination-artists mt-4"></div>
      </Swiper>
    </section>
  );
} 