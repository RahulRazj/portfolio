import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://spot-api-theta.vercel.app/api/currently-playing.js');
    
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