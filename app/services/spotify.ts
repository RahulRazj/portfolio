// Simple Spotify service using local API endpoints that proxy to the public API
const BASE_API_URL = '/api/spotify';

export interface CurrentlyPlayingResponse {
  isPlaying: boolean;
  track?: {
    title: string;
    artist: string;
    album: string;
    image?: string;
    songUrl?: string;
  };
  error?: string;
}

export interface TopTracksResponse {
  tracks: Array<{
    name: string;
    artist: string;
    album: string;
    image?: string;
    external_urls?: {
      spotify: string;
    };
    popularity?: number;
  }>;
  error?: string;
}

export interface TopArtistsResponse {
  artists: Array<{
    name: string;
    image?: string;
    external_urls?: {
      spotify: string;
    };
    popularity?: number;
    genres?: string[];
  }>;
  error?: string;
}

// Fetch currently playing track
export async function getCurrentlyPlaying(): Promise<CurrentlyPlayingResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/currently-playing`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle the case where nothing is playing
    if (!data || data.error || !data.isPlaying) {
      return {
        isPlaying: false,
        error: data?.error || undefined
      };
    }

    console.log('Fetched currently playing data:', data);
    
    return {
      isPlaying: true,
      track: {
        title: data.title || 'Unknown Track',
        artist: data.artist || 'Unknown Artist',
        album: data.album || 'Unknown Album',
        image: data.albumImageUrl,
        songUrl: data.songUrl
      }
    };
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return {
      isPlaying: false,
      error: 'Failed to fetch currently playing'
    };
  }
}

// Fetch top tracks
export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<TopTracksResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/top-tracks?time_range=${timeRange}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return {
        tracks: [],
        error: data.error
      };
    }
    
    return {
      tracks: data.tracks || []
    };
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return {
      tracks: [],
      error: 'Failed to fetch top tracks'
    };
  }
}

// Fetch top artists
export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<TopArtistsResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/top-artists?time_range=${timeRange}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return {
        artists: [],
        error: data.error
      };
    }
    
    return {
      artists: data.artists || []
    };
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return {
      artists: [],
      error: 'Failed to fetch top artists'
    };
  }
}

// Utility function to format duration
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Utility function to get progress percentage
export function getProgressPercentage(progress_ms: number, duration_ms: number): number {
  if (!progress_ms || !duration_ms) return 0;
  return (progress_ms / duration_ms) * 100;
}