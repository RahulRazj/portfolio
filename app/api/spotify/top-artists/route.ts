import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('time_range') || 'medium_term';
    const limit = searchParams.get('limit') || '5';
    
    const baseUrl = process.env.SPOTIFY_API_BASE_URL || 'https://spot-api-theta.vercel.app';
    const response = await fetch(`${baseUrl}/api/top-artists.js?time_period=${timeRange}&limit=${limit}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Spotify API' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error proxying Spotify top artists API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}