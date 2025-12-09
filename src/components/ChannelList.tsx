import React from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamStream } from '../types/xtream';

interface ChannelListProps {
  channels: XtreamStream[];
  selectedChannelId: number | null;
  onSelectChannel: (id: number) => void;
}

const ChannelItem = ({ channel, isSelected, onSelect }: { channel: XtreamStream, isSelected: boolean, onSelect: () => void }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });

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

export const ChannelList: React.FC<ChannelListProps> = ({ channels, selectedChannelId, onSelectChannel }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CHANNEL_LIST',
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="h-full overflow-y-auto bg-background w-80 border-r border-gray-800">
         {/* Simple Virtualization or Pagination might be needed for large lists, keeping it simple for now */}
         <div className="p-2">
            {channels.map((channel) => (
            <ChannelItem
                key={channel.stream_id}
                channel={channel}
                isSelected={channel.stream_id === selectedChannelId}
                onSelect={() => onSelectChannel(channel.stream_id)}
            />
            ))}
            {channels.length === 0 && (
                <div className="p-4 text-center text-gray-500">No channels found</div>
            )}
        </div>
      </div>
    </FocusContext.Provider>
  );
};
