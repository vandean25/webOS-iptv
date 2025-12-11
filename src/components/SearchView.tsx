import React, { useEffect, useState } from 'react';
import { useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { useLiveStore } from '../store/liveStore';
import { ChannelCard } from './ChannelCard';
import { FocusableInput } from './FocusableInput';
import { XtreamStream } from '../types/xtream';
import { useFavorites } from '../hooks/useFavorites';

export const SearchView: React.FC = () => {
  const {
    isSearchActive,
    searchQuery,
    performSearch,
    allChannels,
    disableSearch,
    selectChannel,
    setPlayerActive,
    updateFavorites,
  } = useLiveStore();

  const { ref, focusKey } = useFocusable({
    focusKey: 'SEARCH_VIEW',
    isFocusBoundary: true,
  });

  const [searchInput, setSearchInput] = useState(searchQuery);
  const { toggleFavorite } = useFavorites();

  useEffect(() => {
    if (isSearchActive) {
      setFocus('SEARCH_INPUT');
    }
  }, [isSearchActive]);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, performSearch]);

  const handleToggleFavorite = (channel: XtreamStream) => {
    toggleFavorite(channel);
    updateFavorites();
  };

  if (!isSearchActive) {
    return null;
  }

  const searchResults = searchQuery
    ? allChannels.filter(channel => channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="fixed inset-0 bg-brand-dark bg-opacity-95 z-50 flex flex-col p-8"
      >
        <div className="w-full max-w-3xl mx-auto">
          <FocusableInput
            focusKey="SEARCH_INPUT"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for channels..."
            className="text-2xl p-4 rounded-lg bg-brand-gray border-2 border-transparent"
          />
        </div>

        <div className="flex-1 mt-8 overflow-y-auto">
          <div className="grid grid-cols-5 gap-4">
            {searchResults.map((channel: XtreamStream) => (
              <ChannelCard
                key={channel.stream_id}
                channel={channel}
                onSelect={() => {}}
                onPlay={() => {
                  selectChannel(channel.stream_id);
                  setPlayerActive(true);
                  disableSearch();
                }}
                onToggleFavorite={() => handleToggleFavorite(channel)}
              />
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};
