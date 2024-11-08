'use client'

import { useQuery } from '@tanstack/react-query'
import { getLikedSongs, getPostedSongs, getSavedSongs } from '@/services/songService'
import { getUserById } from '@/services/userService'
import ProtectedRoute from '@/components/ProtectedRoute'
import SongList from './SongList'
import ProfileInfo from './ProfileInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Main Profile Component
export default function Profile() {

  const { data: user, isLoading: userLoading, error: userError }: any = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserById()
  })

  const { data: postedSongs, isLoading: postedLoading, error: postedError }: any = useQuery({
    queryKey: ['postedSongs'],
    queryFn: () => getPostedSongs()
  })

  const { data: savedSongs, isLoading: savedLoading, error: savedError }: any = useQuery({
    queryKey: ['savedSongs'],
    queryFn: () => getSavedSongs()
  })

  const { data: likedSongs, isLoading: likedLoading, error: likedError }: any = useQuery({
    queryKey: ['likedSongs'],
    queryFn: () => getLikedSongs()
  })

  if (userLoading) return (
    <div className="container mx-auto px-4 py-8 space-y-8 pt-24">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* <Skeleton className="h-20 w-20 rounded-full" /> */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-full sm:w-40" />
        </CardContent>
      </Card>
      {/* Song List Sections Skeletons */}
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
  if (userError) return <div className="text-center py-8 text-red-500">Error loading profile</div>
  if (!user) return <div className="text-center py-8">User not found</div>

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 pt-24">
        <ProfileInfo user={user} />
        <SongList
          title="Saved Songs"
          songs={savedSongs}
          isLoading={savedLoading}
          error={savedError}
          queryKey={'savedSongs'}
        />
        <SongList
          title="Posted Songs"
          songs={postedSongs}
          isLoading={postedLoading}
          error={postedError}
          queryKey={'postedSongs'}
        />

        <SongList
          title="Recently Liked"
          songs={likedSongs}
          isLoading={likedLoading}
          error={likedError}
          queryKey={'likedSongs'}
        />
      </div>
    </ProtectedRoute>
  )
}