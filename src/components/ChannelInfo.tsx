import React from 'react';
import type { XtreamStream, XtreamEPGResponse } from '../types/xtream';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Skeleton } from './Skeleton';
import { getStreamQualityTags } from '../utils/streamUtils';

interface ChannelInfoProps {
  channel: XtreamStream | null;
  epg: XtreamEPGResponse | null;
  isLoadingEPG?: boolean;
  onWatch: () => void;
}

const EPGDisplay = ({ epg }: { epg: XtreamEPGResponse | null }) => {
    if (!epg || !epg.epg_listings || epg.epg_listings.length === 0) {
        return <p className="italic text-gray-500">No Program Information Available</p>;
    }

    const currentProgram = epg.epg_listings[0];
    const nextProgram = epg.epg_listings[1];

    const decode = (str: string) => {
        try {
             return atob(str);
        } catch {
             return str;
        }
    };

    return (
        <div className="text-left w-full mt-4 bg-black/20 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-1">{decode(currentProgram.title)}</h3>
            <p className="text-sm text-gray-400 mb-2">
                {currentProgram.start.substring(11, 16)} - {currentProgram.end.substring(11, 16)}
            </p>
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{decode(currentProgram.description)}</p>

            {nextProgram && (
                <div className="border-t border-gray-700 pt-2">
                    <span className="text-xs uppercase text-gray-500 font-bold">Next:</span>
                    <p className="text-sm text-gray-300">{decode(nextProgram.title)}</p>
                </div>
            )}
        </div>
    );
};

export const ChannelInfo: React.FC<ChannelInfoProps> = ({ channel, epg, isLoadingEPG, onWatch }) => {
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

  const tags = getStreamQualityTags(channel.name);

  return (
    <div className="flex-1 bg-background p-8 flex flex-col items-center justify-start pt-20">
      <div className="w-32 h-32 bg-surface mb-6 rounded-full overflow-hidden border-4 border-surface shadow-xl">
         {channel.stream_icon ? (
             <img src={channel.stream_icon} alt={channel.name} className="w-full h-full object-cover" />
         ) : (
             <div className="w-full h-full flex items-center justify-center text-3xl font-bold">TV</div>
         )}
      </div>

      <h1 className="text-4xl font-bold text-center mb-2">{channel.name}</h1>

      {/* Badges */}
      <div className="flex space-x-2 mb-4">
        {tags.is4K && <span className="px-2 py-0.5 rounded bg-yellow-500 text-black text-xs font-bold">4K UHD</span>}
        {tags.isHEVC && <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-bold">HEVC</span>}
        {tags.isFHD && <span className="px-2 py-0.5 rounded bg-gray-600 text-white text-xs font-bold">FHD</span>}
      </div>

      <div className="bg-surface p-6 rounded-lg w-full max-w-2xl text-center">
          <p className="text-gray-400 mb-2">Stream ID: {channel.stream_id}</p>
          <p className="text-gray-400">Added: {new Date(parseInt(channel.added) * 1000).toLocaleDateString()}</p>
          {/* EPG placeholder */}
          <div className="mt-8 border-t border-gray-700 pt-4 w-full">
              {isLoadingEPG ? (
                  <Skeleton count={3} className="h-4" />
              ) : (
                  <EPGDisplay epg={epg} />
              )}
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
