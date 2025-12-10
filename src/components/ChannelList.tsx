import React, { useEffect, useState } from 'react';
import { useFocusable, FocusContext, setFocus as setSpatialFocus } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamStream } from '../types/xtream';
import { Skeleton } from './Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import { useTVRemote } from '../hooks/useTVRemote';
import { FocusableInput } from './FocusableInput';
import { useLiveStore } from '../store/liveStore';
import { getStreamQualityTags } from '../utils/streamUtils';

const ChannelItem = ({
    channel,
    isSelected,
    onSelect,
    onPlay,
    onToggleFavorite
}: {
    channel: XtreamStream,
    isSelected: boolean,
    onSelect: () => void,
    onPlay: () => void,
    onToggleFavorite: () => void
}) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onPlay,
    onFocus: onSelect
  });

  const { isFavorite } = useFavorites();
  const isFav = isFavorite(channel.stream_id);
  const tags = getStreamQualityTags(channel.name);

  useEffect(() => {
    if (focused) {
        onSelect();
    }
  }, [focused]);

  // Handle Red Button for Favorites on current item
  useTVRemote({
      'Red': () => {
          if (focused) onToggleFavorite();
      }
  }, focused);

  return (
    <div
      ref={ref}
      className={classNames(
        'p-3 cursor-pointer border-b border-gray-800 flex items-center space-x-3 transition-all relative',
        {
          'bg-primary text-white scale-105 z-10': focused,
          'bg-transparent text-gray-300': !focused,
          'bg-gray-800': isSelected && !focused
        }
      )}
      onClick={onSelect}
    >
        <div className="w-8 h-8 bg-black rounded flex-shrink-0 overflow-hidden relative">
            {channel.stream_icon ? (
                <img
                    src={channel.stream_icon}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
            ) : (
                <div className="text-xs flex items-center justify-center h-full text-gray-500">TV</div>
            )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
             <span className="truncate text-sm">{channel.name}</span>
             <div className="flex space-x-1 mt-0.5">
                {tags.is4K && <span className="text-[10px] leading-none px-1 rounded bg-yellow-500 text-black font-bold">4K</span>}
                {tags.isHEVC && <span className="text-[10px] leading-none px-1 rounded bg-blue-600 text-white font-bold">HEVC</span>}
             </div>
        </div>

        {/* Favorite Icon / Button */}
        <div onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="cursor-pointer p-1">
            {isFav ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
            ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className={classNames("h-5 w-5", focused ? "text-white/50" : "text-gray-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )}
        </div>
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
<<<<<<< HEAD
  const { ref, focusKey } = useFocusable({
=======
  // @ts-ignore - setFocus is missing in some type definitions but exists at runtime
  const { ref, focusKey, setFocus } = useFocusable({
>>>>>>> 232dec2 (Add mock 4K HEVC test channel and debug mode)
    focusKey: 'CHANNEL_LIST',
    trackChildren: true
  });

  const { isSearchActive, performSearch, updateFavorites } = useLiveStore();
  const { toggleFavorite } = useFavorites();
  const [searchInput, setSearchInput] = useState('');

  // Auto-focus on search input when search becomes active
  useEffect(() => {
    if (isSearchActive) {
      // Small delay to ensure component is mounted and registered with spatial nav
      const t = setTimeout(() => {
          setSpatialFocus('SEARCH_INPUT');
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isSearchActive]);

  // Debounce search
  useEffect(() => {
      const timer = setTimeout(() => {
          if (isSearchActive) {
              performSearch(searchInput);
          }
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
  }, [searchInput, isSearchActive, performSearch]);

  const handleToggleFavorite = (channel: XtreamStream) => {
      toggleFavorite(channel);
      updateFavorites(); // Refresh list if we are in Favorites category
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="h-full overflow-y-auto bg-background/80 backdrop-blur-md w-80 border-r border-gray-800 flex flex-col">

         {isSearchActive && (
             <div className="p-2 border-b border-gray-700">
                 <FocusableInput
                    focusKey="SEARCH_INPUT"
                    placeholder="Search channels..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2"
                 />
             </div>
         )}

         <div className="p-2 flex-1 overflow-y-auto">
            {isLoading ? (
                <div className="space-y-3 p-2">
                    <Skeleton className="h-10" count={10} />
                </div>
            ) : (
                <>
                    {(Array.isArray(channels) ? channels : []).map((channel) => (
                    <ChannelItem
                        key={channel.stream_id}
                        channel={channel}
                        isSelected={channel.stream_id === selectedChannelId}
                        onSelect={() => onSelectChannel(channel.stream_id)}
                        onPlay={() => onPlayChannel(channel.stream_id)}
                        onToggleFavorite={() => handleToggleFavorite(channel)}
                    />
                    ))}
                    {channels.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            {isSearchActive && !searchInput ? 'Type to search...' : (isSearchActive ? 'No results' : 'No channels found')}
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
    </FocusContext.Provider>
  );
};
