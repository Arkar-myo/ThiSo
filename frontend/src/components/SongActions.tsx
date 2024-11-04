import React, { useActionState, useState, useEffect } from 'react';
import { Eye, Heart, MessageCircle, MoreVertical, Edit2, Trash2, Flag, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toastFunc } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { ReportReason, reportSong, saveSong, Song, unsaveSong } from '@/services/songService';
import { User } from '@/services/userService';

interface SongActionsProps {
    // viewCount: number;
    // likeCount: number;
    // commentCount: number;
    songData: Song;
    onLike: () => void;
    isLiked: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    canManage?: boolean;
    className?: string;
    disabled?: boolean;
    // songId: string;
    isLoggedIn?: boolean;
    onSave: (songId: string) => void;
    onSaveInclude?: boolean;
    isSaved?: boolean;
    userData?: User;
}

export default function SongActions({
    songData,
    onLike,
    isLiked,
    isSaved,
    onEdit,
    onDelete,
    canManage,
    className = "",
    disabled = false,
    // songId,
    isLoggedIn,
    onSave,
    onSaveInclude,
    userData,

}: SongActionsProps) {
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState<ReportReason | ''>('');
    const [reportDescription, setReportDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [isSaved, setIsSaved] = useState(false);
    // const [isLiked, setIsLiked] = useState(false);

    // Initialize isSaved based on songData when the component mounts
    useEffect(() => {
        const saved = songData.savedSongs?.some((eachSave) => eachSave.songId === songData.id && eachSave.userId === userData?.id);
        // setIsSaved(saved || false);
        isSaved = saved || false;
    }, [songData, userData]);

    // if(songData.savedSongs?.some((eachSave) => eachSave.songId === songData.id && eachSave.userId === userData?.id)) {
    //     setIsSaved(true);
    // }

    // if(songData.songLikes?.some((eachLike) => eachLike.userId === userData?.id)) {
    //     setIsLiked(true);
    // }

    const handleReport = async () => {
        if (!reportReason) {
            toastFunc({
                title: "Error",
                description: "Please select a reason for reporting",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await reportSong(songData.id, {
                reason: reportReason as ReportReason,
                description: reportDescription,
            });

            toastFunc({
                title: "Success",
                description: "Song has been reported successfully",
            });

            setIsReportDialogOpen(false);
            setReportReason('');
            setReportDescription('');
        } catch (error) {
            toastFunc({
                title: "Error",
                description: "Failed to report song",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLoggedIn) {
            setIsReportDialogOpen(true);
        } else {
            toast.error('Please login to report songs');
        }
    };

    // const handleSave = async () => {
    //     if (!isLoggedIn) {
    //         toast.error('Please login to save songs');
    //         return;
    //     }

    //     try {
    //         await saveSong(songId);
    //         toast.success('Song saved successfully');
    //     } catch (error) {
    //         toast.error('Failed to save song');
    //     }
    // };

    const handleSaveToggleInSongPage = async () => {
        if (!isLoggedIn) {
            toast.error('Please login to save songs');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isSaved) {
                await unsaveSong(songData.id); // Call the delete saved song API
                toast.success('Song unsaved successfully');
            } else {
                await saveSong(songData.id); // Call the save song API
                toast.success('Song saved successfully');
            }
            // setIsSaved(!isSaved); // Toggle the saved state
        } catch (error) {
            toast.error('Failed to save/unsave song');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="space-x-2" disabled={disabled}>
                    <Eye className="h-4 w-4" />
                    <span>{songData.viewCount || 0}</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-2"
                    onClick={onLike}
                    disabled={disabled}
                >
                    <Heart
                        className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`}
                    />
                    <span>{songData.songLikes?.length || 0}</span>
                </Button>
                {/* <Button variant="ghost" size="sm" className="space-x-2" disabled={disabled}>
                    <MessageCircle className="h-4 w-4" />
                    <span>{songData.commentCount || 0}</span>
                </Button> */}
                {onSaveInclude && <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-2"
                    disabled={disabled}
                    onClick={handleSaveToggleInSongPage}
                >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-yellow-500' : ''}`} />
                </Button>}
            </div>

            {canManage && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={disabled}>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Song</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this song? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                            <Flag className="mr-2 h-4 w-4" />
                            Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {!canManage && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleReportClick}>
                            <Flag className="mr-2 h-4 w-4" />
                            Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Report Song</DialogTitle>
                        <DialogDescription>
                            Please provide details about why you're reporting this song.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reason</label>
                            <Select
                                value={reportReason}
                                onValueChange={(value) => setReportReason(value as ReportReason)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ReportReason).map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="Provide additional details about the issue..."
                                value={reportDescription}
                                onChange={(e) => setReportDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsReportDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReport}
                            disabled={!reportReason || isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 