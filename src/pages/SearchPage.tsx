import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import ChannelCard from '../components/layout/ChannelCard';
import { useLiveStore } from '../store/liveStore';
import { useNavigate } from 'react-router-dom';
import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import { FocusableInput } from '../components/FocusableInput';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { allChannels, fetchAllChannels } = useLiveStore();
  const navigate = useNavigate();
  const { ref } = useFocusable();

  // Fetch all channels once when the component mounts
  useEffect(() => {
    if (allChannels.length === 0) {
      fetchAllChannels();
    }
  }, [allChannels, fetchAllChannels]);

  const onChannelPress = (channelId: string) => {
    navigate(`/live/${channelId}`);
  };

  const filteredChannels = useMemo(() => {
    if (!query) return [];
    return allChannels
      .filter((channel) =>
        channel.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 100); // Performance: limit results
  }, [query, allChannels]);

  // When the search query changes, focus the first card if results are available
  useEffect(() => {
    if (query && filteredChannels.length > 0) {
        setFocus(`CH_${filteredChannels[0].stream_id}`);
    } else {
        setFocus('SEARCH_INPUT');
    }
  }, [query, filteredChannels]);

  return (
    <div ref={ref} className="flex flex-col h-screen w-full overflow-hidden bg-background-dark text-white">
      <Header title="Search" subtitle="Find any channel" />

      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-48 pt-4">
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.stream_id}
                channel={{
                  id: channel.stream_id.toString(),
                  name: channel.name,
                  logo: channel.stream_icon,
                  epg: null,
                }}
                onEnterPress={() => onChannelPress(channel.stream_id.toString())}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-lg">{query ? 'No results found.' : 'Start typing to search.'}</p>
          </div>
        )}
      </main>

      <div className="absolute bottom-24 left-0 right-0 px-8 z-20 flex justify-center">
         <div className="w-full max-w-lg">
            <FocusableInput
                focusKey="SEARCH_INPUT"
                placeholder="Search channels..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent pointer-events-none z-10" />
      <BottomNavBar />
    </div>
  );
};

export default SearchPage;
