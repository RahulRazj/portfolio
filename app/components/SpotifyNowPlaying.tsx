'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSpotify, FaMobileAlt, FaTabletAlt, FaHeadphones } from 'react-icons/fa';
import { FaComputer } from "react-icons/fa6";
import Image from 'next/image';
import { getCurrentlyPlaying, type CurrentlyPlayingResponse, formatDuration } from '../services/spotify';

// This component displays the user's currently playing Spotify track
// It includes a progress bar that updates in real-time
// For long track titles, it uses a custom scrolling text animation

// Scrolling text component for long titles
function ScrollingText({ text, className, maxWidth = 140 }: {
  readonly text: string;
  readonly className?: string;
  readonly maxWidth?: number
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsScrolling(textWidth > maxWidth);
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

  return (
    <div
      className="overflow-hidden"
      style={{ maxWidth: `${maxWidth}px` }}
    >
      <div
        ref={textRef}
        className={`${className} whitespace-nowrap`}
        style={{
          animation: 'scroll-left-right 10s linear infinite',
        }}
      >
        {text}
      </div>
    </div>
  );
}

function DeviceIcon({ type }: { readonly type: string }) {
  switch (type) {
    case 'Computer':
      return <FaComputer className="w-4 h-4 text-green-500" />;
    case 'Smartphone':
      return <FaMobileAlt className="w-4 h-4 text-green-500" />;
    case 'Tablet':
      return <FaTabletAlt className="w-4 h-4 text-green-500" />;
    default:
      return;
  }
}

// Main component for the Spotify Now Playing widget
export default function SpotifyNowPlaying() {
  const [currentTrack, setCurrentTrack] = useState<CurrentlyPlayingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [showDesktopHover, setShowDesktopHover] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const lastTrackId = useRef<string | null>(null);

  const fetchCurrentlyPlaying = async () => {
    try {
      const data = await getCurrentlyPlaying();
      setCurrentTrack(data);

      if (data.isPlaying && data.track) {
        if (data.isPlaying && data.track) {
          lastTrackId.current = data.track.title;
          setProgress((data.track.progressMs || 0) + 1000); // Add 1 second to account for fetch time
        }
      }
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

    const pollInterval = Number.parseInt(process.env.NEXT_PUBLIC_SPOTIFY_POLL_INTERVAL || '5000', 10);
    const interval = setInterval(fetchCurrentlyPlaying, pollInterval);

    return () => clearInterval(interval);
  }, []);

  // Timer to update the progress bar every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentTrack?.isPlaying && currentTrack?.track?.durationMs) {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 1000;
          return newProgress < currentTrack?.track?.durationMs! ? newProgress : currentTrack?.track?.durationMs!;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTrack]);

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

  useEffect(() => {
    if (showMobileTooltip) {
      const timer = setTimeout(() => {
        setShowMobileTooltip(false);
      }, 3000); // Increased duration for better UX

      return () => clearTimeout(timer);
    }
  }, [showMobileTooltip]);

  if (isLoading) {
    return (
      <div className="bg-black/60 backdrop-blur-lg rounded-lg border border-gray-700 p-3 w-full md:w-[280px] min-w-[48px] max-w-[48px] md:max-w-none">
        <div className="flex items-center gap-3 md:flex hidden">
          <FaSpotify className="w-6 h-6 text-green-500 animate-pulse" />
          <div className="w-8 h-8 rounded-md bg-gray-700 animate-pulse flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
        <div className="md:hidden flex items-center justify-center">
          <FaSpotify className="w-6 h-6 text-green-500 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentTrack || currentTrack.error) {
    return null;
  }

  const progressPercentage = currentTrack.track?.durationMs
    ? (progress / currentTrack.track.durationMs) * 100
    : 0;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
    <div
      className={`bg-black/60 backdrop-blur-lg rounded-lg border transition-all duration-300 p-3 w-full md:w-[280px] min-w-[48px] max-w-[48px] md:max-w-none relative ${currentTrack?.isPlaying
          ? 'border-green-500/50 pb-2'
          : 'border-gray-700'
        }`}
      onMouseEnter={() => setShowDesktopHover(true)}
      onMouseLeave={() => setShowDesktopHover(false)}
    >
      <div className="flex flex-col h-full">
        {/* Desktop view */}
        <div className="items-center gap-3 md:flex hidden flex-grow">
          <div className="relative">
            <FaSpotify
              className={`w-5 h-5 transition-colors duration-300 ${currentTrack?.isPlaying ? 'text-green-500' : 'text-gray-500'
                }`}
            />
            {currentTrack?.isPlaying && (
              <div className="absolute -inset-1">
                <div className="w-7 h-7 border-2 border-green-500/30 rounded-full animate-ping"></div>
              </div>
            )}
          </div>

          {currentTrack?.isPlaying && currentTrack?.track?.image && (
            <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={currentTrack.track.image}
                alt={`${currentTrack.track.album} album cover`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <ScrollingText
              text={currentTrack?.track?.title || 'Offline'}
              className={`text-sm font-medium transition-colors duration-300 ${currentTrack?.isPlaying ? 'text-white' : 'text-gray-400'
                }`}
              maxWidth={150}
            />

            {currentTrack?.track?.artist && (
              <div className="text-sm text-gray-400 truncate">
                {currentTrack.track.artist}
              </div>
            )}

            {!currentTrack?.isPlaying && (
              <div className="text-sm text-gray-500">
                Not playing
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden relative">
          <button
            className="flex items-center justify-center cursor-pointer bg-transparent border-none p-0 w-full h-full"
            onClick={() => setShowMobileTooltip(!showMobileTooltip)}
            aria-label="Show current playing song details"
          >
            <div className="relative">
              <FaSpotify
                className={`w-6 h-6 transition-colors duration-300 ${currentTrack?.isPlaying ? 'text-green-500' : 'text-gray-500'
                  }`}
              />
              {currentTrack?.isPlaying && (
                <div className="absolute -inset-1">
                  <div className="w-8 h-8 border-2 border-green-500/30 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </button>

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
                      unoptimized
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium mb-1 ${currentTrack?.isPlaying ? 'text-white' : 'text-gray-400'
                    }`}>
                    {currentTrack?.track?.title || 'Offline'}
                  </div>

                  {currentTrack?.track?.artist && (
                    <div className="text-xs text-gray-400 truncate">
                      {currentTrack.track.artist}
                    </div>
                  )}

                  {!currentTrack?.isPlaying && (
                    <div className="text-xs text-gray-500">
                      Not playing
                    </div>
                  )}
                </div>
              </div>
              {currentTrack?.isPlaying && currentTrack?.track && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatDuration(progress)}</span>
                    <span>{formatDuration(currentTrack.track.durationMs!)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Hover Popup */}
        {showDesktopHover && currentTrack?.track && (
          <div 
            ref={hoverRef}
            className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 bg-black/95 backdrop-blur-lg rounded-lg border border-gray-700 p-4 w-64 z-50 hidden md:block"
          >
            {currentTrack?.track?.image && (
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-800 mb-4">
                <Image 
                  src={currentTrack.track.image} 
                  alt={`${currentTrack.track.album} album cover`}
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            )}
            
            <div className="text-center space-y-2">
              <div className={`text-lg font-bold ${
                currentTrack?.isPlaying ? 'text-white' : 'text-gray-400'
              }`}>
                {currentTrack?.track?.title || 'Offline'}
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

              {currentTrack?.isPlaying && currentTrack?.track && (
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>{formatDuration(progress)}</span>
                    <span>{formatDuration(currentTrack.track.durationMs!)}</span>
                  </div>
                </div>
              )}

              {currentTrack?.track.deviceName && (
                <div className="flex items-center justify-center text-gray-400 text-sm mt-2">
                  <FaHeadphones className="w-4 h-4 text-green-500" />
                  <span className="ml-2 text-green-500">on {currentTrack.track.deviceName}</span>
                  <span className="ml-1">
                    <DeviceIcon type={currentTrack.track.deviceType!} />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar for Desktop (at the bottom) */}
        {currentTrack?.isPlaying && currentTrack?.track && (
          <div className="mt-1">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                  transition: 'width 1s linear',
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>{formatDuration(progress)}</span>
              <span>
                {formatDuration(currentTrack.track.durationMs!)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}