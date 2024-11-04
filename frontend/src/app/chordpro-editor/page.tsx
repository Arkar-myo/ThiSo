'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileEdit } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import ChordProEditor from '@/components/ChordProEditor'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getSongById, Song } from '@/services/songService'
import { useAuth } from '@/contexts/AuthContext'

export default function ChordProEditorPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [initialSongData, setInitialSongData] = useState<Song | null>(null)
  const t = translations[language]

  useEffect(() => {
    const songId = searchParams?.get('songId')
    if (songId ) {
      const fetchSong = async () => {
        try {
          const song = await getSongById(songId)
          setInitialSongData(song)
        } catch (error) {
          console.error('Error fetching song:', error)
          // You might want to show an error message here
        }
      }
      fetchSong()
    }
  }, [searchParams, user])

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col items-center text-center mb-0">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 mb-4">
            <FileEdit className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {initialSongData ? t.editSong : t.chordproEditor}
          </h1>
          <p className="text-muted-foreground max-w-[700px]">
            {t.chordproEditorDescription}
          </p>
        </div>
        <ChordProEditor initialData={initialSongData} />
      </div>
    </ProtectedRoute>
  )
}
