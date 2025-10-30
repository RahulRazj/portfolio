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
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [showDesktopHover, setShowDesktopHover] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

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

    // Poll for updates - interval controlled by environment variable
    const pollInterval = Number.parseInt(process.env.NEXT_PUBLIC_SPOTIFY_POLL_INTERVAL || '5000', 10);
    const interval = setInterval(fetchCurrentlyPlaying, pollInterval);
    
    return () => clearInterval(interval);
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowMobileTooltip(false);
      }
    };

    if (showMobileTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileTooltip]);

  // Auto-close tooltip after 2 seconds
  useEffect(() => {
    if (showMobileTooltip) {
      const timer = setTimeout(() => {
        setShowMobileTooltip(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showMobileTooltip]);

  if (isLoading) {
    return (
      <div className="bg-black/60 backdrop-blur-lg rounded-lg border border-gray-700 p-3 w-full min-w-[280px] md:min-w-[280px] min-w-[48px] md:w-full w-12">
        <div className="flex items-center gap-3 md:flex hidden">
          <FaSpotify className="w-6 h-6 text-green-500 animate-pulse" />
          <div className="w-8 h-8 rounded-md bg-gray-700 animate-pulse flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
        {/* Mobile view - just icon */}
        <div className="md:hidden flex items-center justify-center">
          <FaSpotify className="w-6 h-6 text-green-500 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentTrack || currentTrack.error) {
    return null; // Don't show if there's an error or no data
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
    <div 
      className={`bg-black/60 backdrop-blur-lg rounded-lg border transition-all duration-300 p-3 w-full min-w-[280px] md:min-w-[280px] min-w-[48px] md:w-full w-12 relative ${
        currentTrack?.isPlaying 
          ? 'border-green-500/50' 
          : 'border-gray-700'
      }`}
      onMouseEnter={() => setShowDesktopHover(true)}
      onMouseLeave={() => setShowDesktopHover(false)}
    >
        {/* Desktop view - full layout */}
        <div className="items-center gap-3 md:flex hidden">
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

        {/* Mobile view - just icon with click tooltip */}
        <div className="md:hidden relative">
          <button 
            className="flex items-center justify-center cursor-pointer bg-transparent border-none p-0 w-full h-full"
            onClick={() => setShowMobileTooltip(!showMobileTooltip)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowMobileTooltip(!showMobileTooltip);
              }
            }}
            aria-label="Show current playing song details"
          >
            <div className="relative">
              <FaSpotify 
                className={`w-6 h-6 transition-colors duration-300 ${
                  currentTrack?.isPlaying ? 'text-green-500' : 'text-gray-500'
                }`} 
              />
              {currentTrack?.isPlaying && (
                <div className="absolute -inset-1">
                  <div className="w-8 h-8 border-2 border-green-500/30 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </button>
          
          {/* Mobile Tooltip */}
          {showMobileTooltip && (
            <div 
              ref={tooltipRef}
              className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-lg rounded-lg border border-gray-700 p-3 min-w-[250px] z-50"
            >
              <div className="flex items-center gap-3">
                {currentTrack?.isPlaying && currentTrack?.track?.image && (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                    <Image 
                      src={currentTrack.track.image} 
                      alt={`${currentTrack.track.album} album cover`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium mb-1 ${
                    currentTrack?.isPlaying ? 'text-white' : 'text-gray-400'
                  }`}>
                    {currentTrack?.error ? 'Spotify Error' : currentTrack?.track?.title || 'Offline'}
                  </div>
                  
                  {currentTrack?.track?.artist && (
                    <div className="text-xs text-gray-400 truncate">
                      {currentTrack.track.artist}
                    </div>
                  )}
                  
                  {!currentTrack?.isPlaying && !currentTrack?.error && (
                    <div className="text-xs text-gray-500">
                      Not playing
                    </div>
                  )}
                  
                  {currentTrack?.error && (
                    <div className="text-xs text-red-400">
                      {currentTrack.error}
                    </div>
                  )}
                </div>
                
                {currentTrack?.isPlaying && (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Hover Popup */}
        {showDesktopHover && (
          <div 
            ref={hoverRef}
            className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 bg-black/95 backdrop-blur-lg rounded-lg border border-gray-700 p-4 w-64 z-50 hidden md:block"
          >
            {/* Album Art */}
            {currentTrack?.track?.image && (
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-800 mb-4">
                <Image 
                  src={currentTrack.track.image} 
                  alt={`${currentTrack.track.album} album cover`}
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                />
              </div>
            )}
            
            {/* Track Information */}
            <div className="text-center space-y-2">
              <div className={`text-lg font-bold ${
                currentTrack?.isPlaying ? 'text-white' : 'text-gray-400'
              }`}>
                {currentTrack?.error ? 'Spotify Error' : currentTrack?.track?.title || 'Offline'}
              </div>
              
              {currentTrack?.track?.artist && (
                <div className="text-gray-300 text-base">
                  {currentTrack.track.artist}
                </div>
              )}
              
              {currentTrack?.track?.album && (
                <div className="text-gray-400 text-sm">
                  {currentTrack.track.album}
                </div>
              )}
              
              {!currentTrack?.isPlaying && !currentTrack?.error && (
                <div className="text-gray-500 text-sm">
                  Not playing
                </div>
              )}
              
              {currentTrack?.error && (
                <div className="text-red-400 text-sm">
                  {currentTrack.error}
                </div>
              )}
              
              {/* Playing indicator */}
              {currentTrack?.isPlaying && (
                <div className="flex items-center justify-center gap-1 mt-3">
                  <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '75ms' }}></div>
                  <div className="w-1 h-5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '225ms' }}></div>
                  <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  );
}