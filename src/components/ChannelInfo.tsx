import React from 'react';
import type { XtreamStream } from '../types/xtream';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

interface ChannelInfoProps {
  channel: XtreamStream | null;
  onWatch: () => void;
}

export const ChannelInfo: React.FC<ChannelInfoProps> = ({ channel, onWatch }) => {
  const { ref, focused } = useFocusable({
      focusKey: 'WATCH_BUTTON',
      onEnterPress: onWatch
  });

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-gray-600">
        Select a channel to view details
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-8 flex flex-col items-center justify-start pt-20">
      <div className="w-32 h-32 bg-surface mb-6 rounded-full overflow-hidden border-4 border-surface shadow-xl">
         {channel.stream_icon ? (
             <img src={channel.stream_icon} alt={channel.name} className="w-full h-full object-cover" />
         ) : (
             <div className="w-full h-full flex items-center justify-center text-3xl font-bold">TV</div>
         )}
      </div>

      <h1 className="text-4xl font-bold text-center mb-4">{channel.name}</h1>

      <div className="bg-surface p-6 rounded-lg w-full max-w-2xl text-center">
          <p className="text-gray-400 mb-2">Stream ID: {channel.stream_id}</p>
          <p className="text-gray-400">Added: {new Date(parseInt(channel.added) * 1000).toLocaleDateString()}</p>
          {/* EPG placeholder */}
          <div className="mt-8 border-t border-gray-700 pt-4">
              <h3 className="text-xl font-semibold mb-2">Current Program</h3>
              <p className="italic text-gray-500">EPG information not available yet.</p>
          </div>

          <div className="mt-8">
             <button
                ref={ref}
                onClick={onWatch}
                className={`px-8 py-3 rounded font-bold uppercase tracking-wider transition-all ${focused ? 'bg-primary text-white scale-110' : 'bg-gray-700 text-gray-300'}`}
             >
                 Watch Now
             </button>
          </div>
      </div>
    </div>
  );
};
