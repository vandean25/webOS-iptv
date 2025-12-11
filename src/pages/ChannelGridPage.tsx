import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import ChannelCard from '../components/layout/ChannelCard';
import { useLiveStore } from '../store/liveStore';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const ChannelGridPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { channels, selectCategory, categories } = useLiveStore();
  const { ref } = useFocusable();

  useEffect(() => {
    if (categoryId) {
      selectCategory(categoryId);
    }
  }, [categoryId, selectCategory]);

  const onChannelPress = (channelId: string) => {
    navigate(`/live/${channelId}`);
  };

  const category = categories.find(c => c.category_id === categoryId);
  const title = category ? category.category_name : 'Channels';

  return (
    <div ref={ref} className="flex flex-col h-screen w-full overflow-hidden bg-background-dark text-white">
      <Header title={title} subtitle="Select a channel" />
      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 pt-4">
        {channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {channels.map((channel) => (
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
            <p className="text-slate-400 text-lg">No channels found in this category.</p>
          </div>
        )}
      </main>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent pointer-events-none z-10" />
      <BottomNavBar />
    </div>
  );
};

export default ChannelGridPage;
