import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.SPOTIFY_API_BASE_URL || 'https://spot-api-theta.vercel.app';
    // using player-state endpoint to get device info along with currently playing track
    const response = await fetch(`${baseUrl}/api/player-state.js`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Spotify API' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error proxying Spotify API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}