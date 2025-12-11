import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

interface ChannelCardProps {
  channel: {
    id: string;
    name: string;
    logo: string;
    epg: {
      title: string;
      start: number;
      end: number;
    } | null;
  };
  onEnterPress: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onEnterPress }) => {
  const { ref, focused } = useFocusable({ onEnterPress });

  const getProgress = () => {
    if (!channel.epg) return 0;
    const now = Date.now();
    if (now < channel.epg.start) return 0;
    if (now > channel.epg.end) return 100;
    return ((now - channel.epg.start) / (channel.epg.end - channel.epg.start)) * 100;
  };

  return (
    <div
      ref={ref}
      onClick={onEnterPress}
      className={`tv-card group relative flex flex-col gap-3 p-1 rounded-xl cursor-pointer focus:outline-none transition-transform duration-300 ${focused ? 'scale-105 z-10' : ''}`}
      tabIndex={-1}
    >
      <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-surface-dark shadow-lg ring-offset-4 ring-offset-background-dark transition-all duration-300 ${focused ? 'ring-4 ring-primary' : ''}`}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${channel.logo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute bottom-3 left-3 size-10 bg-white/90 rounded-full flex items-center justify-center p-1 shadow-lg">
          <span className="text-black font-bold text-xs">{channel.name}</span>
        </div>
      </div>
      <div className="px-1">
        <h3 className={`text-lg font-bold text-white leading-tight transition-colors ${focused ? 'text-primary' : ''}`}>
          {channel.epg?.title ?? channel.name}
        </h3>
        <p className="text-slate-400 text-sm mt-1 truncate">
          {channel.epg ? new Date(channel.epg.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(channel.epg.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No EPG data'}
        </p>
        <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
          <div className="bg-primary h-full" style={{ width: `${getProgress()}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
