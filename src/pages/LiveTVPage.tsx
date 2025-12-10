import React, { useEffect, useState } from 'react';
import { useLiveStore } from '../store/liveStore';
import LiveService from '../services/LiveService';
import { CategoryList } from '../components/CategoryList';
import { ChannelList } from '../components/ChannelList';
import { ChannelInfo } from '../components/ChannelInfo';
import { VideoPlayer } from '../components/VideoPlayer';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useTVRemote } from '../hooks/useTVRemote';

const LiveTVPage: React.FC = () => {
  const {
    categories,
    channels,
    selectedCategoryId,
    selectedChannelId,
    epg,
    isLoadingCategories,
    isLoadingChannels,
    isLoadingEPG,
    isPlayerActive,
    fetchCategories,
    selectCategory,
    selectChannel,
    setPlayerActive,
    nextChannel,
    prevChannel
  } = useLiveStore();

  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayTimer = React.useRef<NodeJS.Timeout | null>(null);

  const { focusSelf } = useFocusable();

  // Handle Remote Control when Player is Active
  useTVRemote({
    'ArrowUp': () => { nextChannel(); showOverlay(); },
    'ArrowDown': () => { prevChannel(); showOverlay(); },
    'Back': () => { setPlayerActive(false); focusSelf(); }, // Exit player and focus layout
    'Enter': () => showOverlay(),
  }, isPlayerActive);

  const showOverlay = () => {
      setOverlayVisible(true);
      if (overlayTimer.current) clearTimeout(overlayTimer.current);
      overlayTimer.current = setTimeout(() => setOverlayVisible(false), 5000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    focusSelf();
  }, [fetchCategories, focusSelf]);

  useEffect(() => {
    // Whenever channel changes in player mode, show overlay
    if (isPlayerActive) {
        showOverlay();
    }

    // Add activity listeners
    const handleActivity = () => {
        if (isPlayerActive) {
            showOverlay();
        }
    };

    if (isPlayerActive) {
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
    }

    return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
    };
  }, [selectedChannelId, isPlayerActive]);

  // Find the full channel object
  const selectedChannel = channels.find(c => c.stream_id === selectedChannelId) || null;
  const streamUrl = selectedChannel ? LiveService.getStreamUrl(selectedChannel.stream_id) : '';

  if (isPlayerActive && selectedChannel) {
      return (
          <div className="fixed inset-0 bg-black z-50">
              <VideoPlayer
                  src={streamUrl}
                  channelName={selectedChannel.name}
                  overlayVisible={overlayVisible}
                  className="w-full h-full"
                  onError={(e) => console.error("Video Error", e)}
              />

              {/* Overlay */}
              <div className={`absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${overlayVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <h1 className="text-4xl font-bold text-white mb-2">{selectedChannel.num} - {selectedChannel.name}</h1>
                  <div className="flex items-center space-x-4">
                      {selectedChannel.stream_icon && <img src={selectedChannel.stream_icon} className="h-16 w-16 object-contain bg-black/50 rounded" />}
                      <span className="text-gray-300">Live TV</span>
                  </div>
              </div>

              {/* Fullscreen Button */}
              <button
                  onClick={toggleFullscreen}
                  className={`absolute bottom-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all duration-500 z-50 ${overlayVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  aria-label="Toggle Fullscreen"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
              </button>
          </div>
      );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text">
      {/* Pane 1: Categories */}
      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={selectCategory}
        isLoading={isLoadingCategories}
      />

      {/* Pane 2: Channels */}
      <ChannelList
        channels={channels}
        selectedChannelId={selectedChannelId}
        onSelectChannel={selectChannel}
        onPlayChannel={(id) => {
            selectChannel(id);
            setPlayerActive(true);
        }}
        isLoading={isLoadingChannels}
      />

      {/* Pane 3: Info */}
      <ChannelInfo
        channel={selectedChannel}
        epg={epg}
        isLoadingEPG={isLoadingEPG}
        onWatch={() => setPlayerActive(true)}
      />
    </div>
  );
};

export default LiveTVPage;
