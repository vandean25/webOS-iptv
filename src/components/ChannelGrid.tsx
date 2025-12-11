import React from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import type { XtreamStream } from '../types/xtream';
import { ChannelCard } from './ChannelCard';
import { Skeleton } from './Skeleton';
import { useLiveStore } from '../store/liveStore';
import { useFavorites } from '../hooks/useFavorites';

interface ChannelGridProps {
  channels: XtreamStream[];
  selectedChannelId: number | null;
  onSelectChannel: (id: number) => void;
  onPlayChannel: (id: number) => void;
  isLoading?: boolean;
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
  onPlayChannel,
  isLoading,
}) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CHANNEL_GRID',
    trackChildren: true,
  });

  const { updateFavorites } = useLiveStore();
  const { toggleFavorite } = useFavorites();

  const handleToggleFavorite = (channel: XtreamStream) => {
      toggleFavorite(channel);
      updateFavorites();
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} data-purpose="channel-display-grid">
        {isLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {[...Array(16)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {(Array.isArray(channels) ? channels : []).map((channel) => (
              <ChannelCard
                key={channel.stream_id}
                channel={channel}
                onSelect={() => onSelectChannel(channel.stream_id)}
                onPlay={() => onPlayChannel(channel.stream_id)}
                onToggleFavorite={() => handleToggleFavorite(channel)}
              />
            ))}
          </div>
        )}
      </section>
    </FocusContext.Provider>
  );
};
