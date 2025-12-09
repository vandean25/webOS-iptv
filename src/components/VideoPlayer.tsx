import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
  src: string;
  className?: string;
  onEnded?: () => void;
  onError?: (error: any) => void;
  options?: any;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className,
  onEnded,
  onError,
  options
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: false, // We will build custom overlay controls or just pure TV experience
        responsive: true,
        fluid: true,
        sources: [{
          src: src,
          type: 'application/x-mpegURL'
        }],
        html5: {
            vhs: {
                overrideNative: true // Use VHS for consistency if needed, but on WebOS native might be better?
                // Actually, native Safari/WebOS usually supports HLS.
                // Let's try native first, but 'overrideNative: true' forces video.js engine.
                // For 'Task 1' request: "video.js... mit hls.js Support".
                // video.js 7+ has VHS built-in.
            }
        },
        ...options
      }, () => {
        player.on('ended', () => onEnded && onEnded());
        player.on('error', (e: any) => onError && onError(e));

        // Auto focus the player container so it can capture keys?
        // Actually, the key handling is done via global hook, so player just needs to play.
      });
    } else {
      const player = playerRef.current;
      if (player) {
          player.src({ src, type: 'application/x-mpegURL' });
          player.play()?.catch(console.error);
      }
    }
  }, [src, options, onEnded, onError]);

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
    <div data-vjs-player className={className}>
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};
