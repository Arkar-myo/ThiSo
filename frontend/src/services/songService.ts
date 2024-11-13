// import axiosInstance from 'axiosInstance';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

import axiosInstance from '@/lib/axios';
import { Artist, CreateReportDto, CreateSongDto, PaginatedResponse, ReportPaginatedResponse, ReportStatus, Song, SongReport } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw new Error('Failed to fetch songs');
  }
};

export const getSongById = async (id: string): Promise<Song> => {
  try {
    const response = await axiosInstance.get<Song>(`${API_URL}/songs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching song with id ${id}:`, error);
    throw new Error(`Failed to fetch song with id ${id}`);
  }
};

export const searchSongs = async (query: string, page: number = 1): Promise<PaginatedResponse> => {
  const response = await fetch(`${API_URL}/songs/search?q=${encodeURIComponent(query)}&page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to search songs');
  }
  const data = await response.json();
  return data;
};

export const postSong = async (songData: CreateSongDto): Promise<Song> => {
  try {
    const response = await axiosInstance.post<Song>(`${API_URL}/songs`, songData);
    return response.data;
  } catch (error) {
    console.error('Error creating song:', error);
    throw new Error('Failed to create song');
  }
};

export const getFeaturedSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured songs:', error);
    throw new Error('Failed to fetch featured songs');
  }
};

export const deleteSong = async (id: string | undefined): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/songs/${id}`);
  } catch (error) {
    console.error(`Error deleting song with id ${id}:`, error);
    throw new Error(`Failed to delete song with id ${id}`);
  }
};

export const updateSong = async (id: string, songData: CreateSongDto): Promise<Song> => {
  try {
    const response = await axiosInstance.put<Song>(`${API_URL}/songs/${id}`, songData);
    return response.data;
  } catch (error) {
    console.error('Error updating song:', error);
    throw new Error('Failed to update song');
  }
};

export const toggleLikeSong = async (id: string, isLiked: boolean): Promise<any> => {
  try {
    let response;
    if (isLiked) {
      response = await axiosInstance.delete(`${API_URL}/unlike/songs/${id}`);
    } else {
      response = await axiosInstance.post(`${API_URL}/like/songs/${id}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error toggling song like:', error);
    throw new Error('Failed to toggle song like');
  }
};

export const getPopularSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/popular`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular songs:', error);
    throw new Error('Failed to fetch popular songs');
  }
};

export const getMostViewedSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/most-viewed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching most viewed songs:', error);
    throw new Error('Failed to fetch most viewed songs');
  }
};

export const getMostLikedSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/most-liked`);
    return response.data;
  } catch (error) {
    console.error('Error fetching most liked songs:', error);
    throw new Error('Failed to fetch most liked songs');
  }
};



export const getFeaturedArtists = async (): Promise<Artist[]> => {
  try {
    const response = await axiosInstance.get<Artist[]>(`${API_URL}/songs/featured-artists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured artists:', error);
    throw new Error('Failed to fetch featured artists');
  }
};



export const reportSong = async (songId: string | undefined, reportData: CreateReportDto): Promise<void> => {
  try {
    await axiosInstance.post(`${API_URL}/songs/${songId}/report`, reportData);
  } catch (error: any) {
    console.error('Error reporting song:', error);
    if (error.response?.status === 400 && error.response?.data?.msg === 'You have already reported this song') {
      throw new Error('You have already reported this song');
    }
    throw new Error('Failed to report song');
  }
};

export const getReports = async (page: number = 1, status: ReportStatus = ReportStatus.PENDING): Promise<ReportPaginatedResponse> => {
  try {
    const response = await axiosInstance.get<ReportPaginatedResponse>(
      `${API_URL}/reports?page=${page}&status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Failed to fetch reports');
  }
};

export const updateReportStatus = async (reportId: string, status: ReportStatus): Promise<SongReport> => {
  try {
    const response = await axiosInstance.put<SongReport>(`${API_URL}/reports/${reportId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw new Error('Failed to update report status');
  }
};

export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/reports/${reportId}`);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw new Error('Failed to delete report');
  }
};

export const saveSong = async (songId: string | undefined): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${API_URL}/saved-songs`, { songId });
    return response.data;
  } catch (error) {
    console.error('Error saving song:', error);
    throw new Error('Failed to save song');
  }
};

export const unsaveSong = async (songId: string | undefined): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/saved-songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error('Error saving song:', error);
    throw new Error('Failed to save song');
  }
};

export const getPostedSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/posted-songs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posted songs:', error);
    throw new Error('Failed to fetch featured artists');
  }
}

export const getSavedSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/saved-songs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved songs:', error);
    throw new Error('Failed to fetch saved songs');
  }
}

export const getLikedSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<Song[]>(`${API_URL}/songs/liked-songs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    throw new Error('Failed to fetch liked songs');
  }
}

export const getNotis = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get<any>(`${API_URL}/notis`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notis:', error);
    throw new Error('Failed to fetch notis');
  }
}

export const putAllNotisRead = async (): Promise<any> => {
  try {
    const response = await axiosInstance.put<any>(`${API_URL}/notis/read`);
    return response.data;
  } catch (error) {
    console.error('Error update notis:', error);
    throw new Error('Failed to update notis');
  }
}