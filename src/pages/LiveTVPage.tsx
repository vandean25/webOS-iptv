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

  useEffect(() => {
    fetchCategories();
    focusSelf();
  }, [fetchCategories, focusSelf]);

  useEffect(() => {
    // Whenever channel changes in player mode, show overlay
    if (isPlayerActive) {
        showOverlay();
    }
  }, [selectedChannelId, isPlayerActive]);

  // Find the full channel object
  const selectedChannel = channels.find(c => c.stream_id === selectedChannelId) || null;
  const streamUrl = selectedChannel ? LiveService.getStreamUrl(selectedChannel.stream_id) : '';

  if (isPlayerActive && selectedChannel) {
      return (
          <div className="fixed inset-0 bg-black z-50">
              <VideoPlayer
                  src={streamUrl}
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
