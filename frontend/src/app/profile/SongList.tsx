import SongActions from "@/components/SongActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSongActions } from "@/hooks/useSongActions"
import { Song } from "@/services/songService"
import { ChevronUp, ChevronDown, Eye, Heart, MoreHorizontal } from "lucide-react"
import { useState } from "react"

const SongList = ({
  title,
  songs,
  isLoading,
  error,
  queryKey
}: {
  title: string
  songs?: Song[]
  isLoading: boolean
  error: unknown
  queryKey: string
}) => {
  const [showAll, setShowAll] = useState(false)
  const {
    handleOptimisticLike,
    handleDelete,
    handleEdit,
    handleSaveToggle,
    checkIsLiked,
    checkIsSaved,
    user } = useSongActions()

  const toggleShowAll = () => {
    setShowAll((prev) => !prev)
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={toggleShowAll}>
          {showAll ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </Button>
      </CardHeader>
      <p className="h-[1px] w-full bg-muted-foreground opacity-25 mb-3"></p>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error loading songs</div>
        ) : (
          <div className="space-y-4">
            {songs && (showAll ? songs : songs?.slice(0, 3)).map((song) => (
              <div key={song.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div>
                  <h4 className="font-medium">{song.title}</h4>
                  <p className="text-sm text-muted-foreground">{song.singer}</p>
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

              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card >
  )
}

export default SongList