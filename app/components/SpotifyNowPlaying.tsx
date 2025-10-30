'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSpotify } from 'react-icons/fa';
import Image from 'next/image';
import { getCurrentlyPlaying, type CurrentlyPlayingResponse } from '../services/spotify';

// Scrolling text component for long titles with left to right scrolling
function ScrollingText({ text, className, maxWidth = 140 }: { 
  readonly text: string; 
  readonly className?: string; 
  readonly maxWidth?: number 
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Create a temporary element to measure the actual text width
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.style.fontSize = globalThis.getComputedStyle(textRef.current).fontSize;
      tempElement.style.fontFamily = globalThis.getComputedStyle(textRef.current).fontFamily;
      tempElement.style.fontWeight = globalThis.getComputedStyle(textRef.current).fontWeight;
      tempElement.textContent = text;
      
      document.body.appendChild(tempElement);
      const measuredWidth = tempElement.offsetWidth;
      tempElement.remove();
      
      setTextWidth(measuredWidth);
      setIsScrolling(measuredWidth > maxWidth);
    }
  }, [text, maxWidth]);

  if (!isScrolling) {
    return (
      <div 
        ref={textRef}
        className={`${className} truncate`}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        {text}
      </div>
    );
  }

  // Calculate the distance the text needs to move (negative for left-to-right)
  const translateDistance = maxWidth - textWidth;

  return (
    <div 
      className="overflow-hidden relative"
      style={{ maxWidth: `${maxWidth}px` }}
    >
      <div
        ref={textRef}
        className={`${className} whitespace-nowrap`}
        style={{
          animation: 'scroll-text 9s ease-in-out infinite',
          '--translate-distance': `${translateDistance}px`
        } as React.CSSProperties & { '--translate-distance': string }}
      >
        {text}
      </div>
    </div>
  );
}

export default function SpotifyNowPlaying() {
  const [currentTrack, setCurrentTrack] = useState<CurrentlyPlayingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentlyPlaying = async () => {
    try {
      const data = await getCurrentlyPlaying();
      setCurrentTrack(data);
    } catch (err) {
      console.error('Error fetching currently playing:', err);
      setCurrentTrack({
        isPlaying: false,
        error: 'Error fetching'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentlyPlaying();

    // Poll every 20 seconds for updates
    const interval = setInterval(fetchCurrentlyPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black/60 backdrop-blur-lg rounded-lg border border-gray-700 p-3 w-full min-w-[280px]">
        <div className="flex items-center gap-3">
          <FaSpotify className="w-6 h-6 text-green-500 animate-pulse" />
          <div className="w-8 h-8 rounded-md bg-gray-700 animate-pulse flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTrack || currentTrack.error) {
    return null; // Don't show if there's an error or no data
  }

  return (
    <div 
      className={`bg-black/60 backdrop-blur-lg rounded-lg border transition-all duration-300 p-3 w-full min-w-[280px] ${
        currentTrack?.isPlaying 
          ? 'border-green-500/50' 
          : 'border-gray-700'
      }`}
    >
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSpotify 
              className={`w-5 h-5 transition-colors duration-300 ${
                currentTrack?.isPlaying ? 'text-green-500' : 'text-gray-500'
              }`} 
            />
            {currentTrack?.isPlaying && (
              <div className="absolute -inset-1">
                <div className="w-7 h-7 border-2 border-green-500/30 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
          
          {/* Album artwork - only show when playing */}
          {currentTrack?.isPlaying && currentTrack?.track?.image && (
            <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
              <Image 
                src={currentTrack.track.image} 
                alt={`${currentTrack.track.album} album cover`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized={true}
                onError={(e) => {
                  // Hide the image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <ScrollingText
              text={currentTrack?.error ? 'Spotify Error' : currentTrack?.track?.title || 'Offline'}
              className={`text-sm font-medium transition-colors duration-300 ${
                currentTrack?.isPlaying ? 'text-white' : 'text-gray-400'
              }`}
              maxWidth={200}
            />
            
            {currentTrack?.track?.artist && (
              <div className="text-sm text-gray-400 truncate">
                {currentTrack.track.artist}
              </div>
            )}
            
            {!currentTrack?.isPlaying && !currentTrack?.error && (
              <div className="text-sm text-gray-500">
                Not playing
              </div>
            )}
            
            {currentTrack?.error && (
              <div className="text-sm text-red-400">
                {currentTrack.error}
              </div>
            )}
          </div>
          
          {currentTrack?.isPlaying && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
      </div>
  );
}