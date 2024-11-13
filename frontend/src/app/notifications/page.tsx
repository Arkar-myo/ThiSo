'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotis, putAllNotisRead } from '@/services/songService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Bell, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { user } = useAuth();
    const [isNavigating, setIsNavigating] = useState(false)

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotis,
    })

    useEffect(() => {
        const markAllRead = async () => {
            try {
                await putAllNotisRead()
                // toast.success('All notifications marked as read')
                await queryClient.invalidateQueries({ queryKey: ["notis", user] });
            } catch (err) {
                toast.error('Failed to mark notifications as read')
            }
        }

        markAllRead()
    }, [])

    useEffect(() => {
        notiCount()
    }, [notiCount()])

    function notiCount() {
        if (!user) return 0;
        if (isLoading || error) return 0;
        return notifications.filter((noti: any) => !noti.read).length;
    }

    const handleClick = async (noti: any) => {
        setIsNavigating(true);
        router.push(`/songs/${noti.song.id}`);
    }



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen pt-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen pt-24">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center p-6">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-center text-lg font-semibold">Error loading notifications</p>
                        <Button className="mt-4" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <Card className="mb-8 overflow-hidden max-w-2xl mx-auto">
                <CardHeader className="bg-primary text-primary-foreground pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <Bell className="mr-2 h-6 w-6" />
                            Notifications
                        </CardTitle>
                        {notiCount() > 0 && <Badge variant="secondary" className="text-sm">
                            {notiCount()} New
                        </Badge>}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[70vh]">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-semibold">No new notifications</p>
                                <p className="text-muted-foreground">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((noti: any) => (
                                <div key={noti.id} className="p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => handleClick(noti)}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-lg">{noti.user.username}</h4>
                                            <span className="text-muted-foreground mt-1">{noti.content}</span><span> " {noti.song.title} "</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {getTimeDifference(new Date(noti.created))}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </CardContent>
                {isNavigating && (
                    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 overflow-hidden">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </Card>
        </div>
    )
}

function getTimeDifference(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
}