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

  // Calculate quality tags and capability
  const tags = useMemo(() => getStreamQualityTags(channelName), [channelName]);
  const canPlayHevc = useMemo(() => getVideoCapability(), []);

  // Determine if we should prioritize native player
  const isHighQuality = tags.is4K || tags.isHEVC;
  const useNative = isHighQuality && canPlayHevc;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      // Configure buffering options for high quality streams if using fallback
      const bufferConfig = isHighQuality ? {
        maxBufferLength: 60,
        enableWorker: true, // Hint for Hls.js if used
      } : {};

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: false,
        responsive: true,
        fluid: true,
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
        player.on('ended', () => onEnded && onEnded());
        player.on('error', (e: any) => onError && onError(e));
      });
    } else {
      const player = playerRef.current;
      if (player) {
          const type = useNative ? 'application/vnd.apple.mpegurl' : 'application/x-mpegURL';
          player.src({ src, type });
          player.play()?.catch(console.error);
      }
    }
  }, [src, options, onEnded, onError, useNative, isHighQuality]);

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className={`relative ${className}`}>
      <div ref={videoRef} className="w-full h-full" />
      <PlayerOverlay tags={tags} visible={overlayVisible} />
    </div>
  );
};
