'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { Song } from "@/services/songService"
import { useSongActions } from "@/hooks/useSongActions"
import SongActions from "@/components/SongActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SongListProps {
  title: string
  songs?: Song[]
  isLoading: boolean
  error: unknown
  queryKey: string
}

export default function Component({ title, songs, isLoading, error, queryKey }: SongListProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const router = useRouter()
  const {
    handleOptimisticLike,
    handleDelete,
    handleEdit,
    handleSaveToggle,
    checkIsLiked,
    checkIsSaved,
    user
  } = useSongActions()

  const toggleShowAll = () => setShowAll((prev) => !prev)

  const handleClick = async (songId: string) => {
    setIsNavigating(true);
    router.push(`/songs/${songId}`);
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-4">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleShowAll} className="text-muted-foreground hover:text-foreground">
          {showAll ? (
            <>
              Show Less <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show All <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <p>Loading songs...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            <p className="text-center">Error loading songs. Please try again later.</p>
          </div>
        ) : (
          <ul className="divide-y divide-muted">
            {songs && (showAll ? songs : songs.slice(0, 3)).map((song) => (
              <li
                key={song.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50 ${isNavigating ? 'pointer-events-none opacity-50' : ''
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handleClick(song.id)}
                    disabled={isNavigating}
                    className="text-left w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                  >
                    <h4 className="font-semibold text-lg truncate">{song.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{song.singer}</p>
                  </button>
                </div>
                <SongActions
                  songData={song}
                  onLike={() => handleOptimisticLike(song, queryKey)}
                  onSave={() => handleSaveToggle(song, queryKey)}
                  isLiked={checkIsLiked(song)}
                  onEdit={() => handleEdit(song.id)}
                  onDelete={() => handleDelete(song.id)}
                  canManage={user?.id === song.userId || user?.userType === 'admin'}
                  isSaved={checkIsSaved(song)}
                  onSaveInclude={true}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 overflow-hidden">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </Card>
  )
}