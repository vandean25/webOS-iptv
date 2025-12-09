import React, { useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamStream } from '../types/xtream';
import { Skeleton } from './Skeleton';

const ChannelItem = ({
    channel,
    isSelected,
    onSelect,
    onPlay
}: {
    channel: XtreamStream,
    isSelected: boolean,
    onSelect: () => void,
    onPlay: () => void
}) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onPlay,
    onFocus: onSelect
  });

  useEffect(() => {
    if (focused) {
        onSelect();
    }
  }, [focused]);

  return (
    <div
      ref={ref}
      className={classNames(
        'p-3 cursor-pointer border-b border-gray-800 flex items-center space-x-3 transition-all',
        {
          'bg-primary text-white scale-105 z-10': focused,
          'bg-transparent text-gray-300': !focused,
          'bg-gray-800': isSelected && !focused
        }
      )}
      onClick={onSelect}
    >
        <div className="w-8 h-8 bg-black rounded flex-shrink-0 overflow-hidden">
            {channel.stream_icon ? (
                <img src={channel.stream_icon} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as any).style.display = 'none'} />
            ) : (
                <div className="text-xs flex items-center justify-center h-full text-gray-500">TV</div>
            )}
        </div>
        <span className="truncate">{channel.name}</span>
    </div>
  );
};

interface ChannelListProps {
  channels: XtreamStream[];
  selectedChannelId: number | null;
  onSelectChannel: (id: number) => void;
  onPlayChannel: (id: number) => void;
  isLoading?: boolean;
}

export const ChannelList: React.FC<ChannelListProps> = ({ channels, selectedChannelId, onSelectChannel, onPlayChannel, isLoading }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CHANNEL_LIST',
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="h-full overflow-y-auto bg-background/80 backdrop-blur-md w-80 border-r border-gray-800">
         <div className="p-2">
            {isLoading ? (
                <div className="space-y-3 p-2">
                    <Skeleton className="h-10" count={10} />
                </div>
            ) : (
                <>
                    {channels.map((channel) => (
                    <ChannelItem
                        key={channel.stream_id}
                        channel={channel}
                        isSelected={channel.stream_id === selectedChannelId}
                        onSelect={() => onSelectChannel(channel.stream_id)}
                        onPlay={() => onPlayChannel(channel.stream_id)}
                    />
                    ))}
                    {channels.length === 0 && (
                        <div className="p-4 text-center text-gray-500">No channels found</div>
                    )}
                </>
            )}
        </div>
      </div>
    </FocusContext.Provider>
  );
};
