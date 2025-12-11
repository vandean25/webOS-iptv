import React from 'react';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import ChannelCard from '../components/layout/ChannelCard';
import { useLiveStore } from '../store/liveStore';
import { useNavigate } from 'react-router-dom';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';
import { FAVORITES_CATEGORY_ID } from '../store/liveStore';

const FavoritesPage: React.FC = () => {
  const { channels: favorites, selectCategory } = useLiveStore();
  const navigate = useNavigate();
  const { ref } = useFocusable();

  useEffect(() => {
    selectCategory(FAVORITES_CATEGORY_ID);
  }, [selectCategory]);

  const onChannelPress = (channelId: string) => {
    navigate(`/live/${channelId}`);
  };

  return (
    <div ref={ref} className="flex flex-col h-screen w-full overflow-hidden bg-background-dark text-white">
      <Header title="Favorites" subtitle="My Channels" />
      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 pt-4">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {favorites.map((channel) => (
              <ChannelCard
                key={channel.stream_id}
                channel={{
                  id: channel.stream_id.toString(),
                  name: channel.name,
                  logo: channel.stream_icon,
                  epg: null, // EPG data can be fetched later
                }}
                onEnterPress={() => onChannelPress(channel.stream_id.toString())}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-lg">You haven't added any favorites yet.</p>
          </div>
        )}
      </main>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent pointer-events-none z-10" />
      <BottomNavBar />
    </div>
  );
};

export default FavoritesPage;
