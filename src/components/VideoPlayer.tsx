import React, { useEffect, useRef, useMemo } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';
import { getStreamQualityTags, getVideoCapability } from '../utils/streamUtils';
import { PlayerOverlay } from './PlayerOverlay';

interface VideoPlayerProps {
  src: string;
  className?: string;
  onEnded?: () => void;
  onError?: (error: any) => void;
  options?: any;
  channelName?: string;
  overlayVisible?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className,
  onEnded,
  onError,
  options,
  channelName = '',
  overlayVisible = true
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);

  // Update refs when props change
  useEffect(() => {
    onEndedRef.current = onEnded;
    onErrorRef.current = onError;
  }, [onEnded, onError]);

  // Calculate quality tags and capability
  const tags = useMemo(() => getStreamQualityTags(channelName), [channelName]);
  const canPlayHevc = useMemo(() => getVideoCapability(), []);

  // Determine if we should prioritize native player
  const isHighQuality = tags.is4K || tags.isHEVC;
  const useNative = isHighQuality && canPlayHevc;

  useEffect(() => {
    let player: Player | null = null;

    if (!videoRef.current) return;

    // Create element to ensure clean state
    const videoElement = document.createElement("video-js");
    videoElement.classList.add('vjs-big-play-centered');

    // Add attributes for WebOS stability
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('preload', 'auto');

    videoRef.current.appendChild(videoElement);

    // Configure buffering options for high quality streams if using fallback
    const bufferConfig = isHighQuality ? {
      maxBufferLength: 60,
      enableWorker: true, // Hint for Hls.js if used
    } : {};

    player = videojs(videoElement, {
      autoplay: true,
      controls: false,
      responsive: true,
      fluid: true,
      preload: 'auto',
      sources: [{
        src: src,
        // Use 'application/vnd.apple.mpegurl' for native compatibility,
        // though 'application/x-mpegURL' is standard for video.js.
        // Native players usually handle both, but 'vnd.apple.mpegurl' is safer for pure HLS pass-through.
        type: useNative ? 'application/vnd.apple.mpegurl' : 'application/x-mpegURL'
      }],
      html5: {
          vhs: {
              // If using native, we do NOT want to override it.
              // So overrideNative should be false.
              overrideNative: !useNative,
          },
          nativeVideoTracks: useNative,
          nativeAudioTracks: useNative,
          hls: {
              ...bufferConfig
          }
      },
      ...options
    }, () => {
      if (player) {
        player.on('ended', () => onEndedRef.current && onEndedRef.current());
        player.on('error', (e: any) => onErrorRef.current && onErrorRef.current(e));
      }
    });

    playerRef.current = player;

    // Cleanup function
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [src, options, useNative, isHighQuality]);

  return (
    <div data-vjs-player className={`relative ${className}`}>
      <div ref={videoRef} className="w-full h-full" />
      <PlayerOverlay tags={tags} visible={overlayVisible} />

      {/* Visual Debug Indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded text-xs font-mono z-50 pointer-events-none">
        DEBUG MODE: {useNative ? 'NATIVE (WebOS)' : 'VHS (Hls.js)'}
      </div>
    </div>
  );
};
