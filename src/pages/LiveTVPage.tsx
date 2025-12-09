import React, { useEffect } from 'react';
import { useLiveStore } from '../store/liveStore';
import { CategoryList } from '../components/CategoryList';
import { ChannelList } from '../components/ChannelList';
import { ChannelInfo } from '../components/ChannelInfo';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const LiveTVPage: React.FC = () => {
  const {
    categories,
    channels,
    selectedCategoryId,
    selectedChannelId,
    fetchCategories,
    selectCategory,
    selectChannel
  } = useLiveStore();

  const { focusSelf } = useFocusable();

  useEffect(() => {
    fetchCategories();
    focusSelf();
  }, [fetchCategories, focusSelf]);

  // Find the full channel object for the info pane
  const selectedChannel = channels.find(c => c.stream_id === selectedChannelId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text">
      {/* Pane 1: Categories */}
      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={selectCategory}
      />

      {/* Pane 2: Channels */}
      <ChannelList
        channels={channels}
        selectedChannelId={selectedChannelId}
        onSelectChannel={selectChannel}
      />

      {/* Pane 3: Info / Player Placeholder */}
      <ChannelInfo channel={selectedChannel} />
    </div>
  );
};

export default LiveTVPage;
