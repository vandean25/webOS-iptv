import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamStream } from '../types/xtream';
import { useFavorites } from '../hooks/useFavorites';

interface ChannelCardProps {
  channel: XtreamStream;
  onSelect: () => void;
  onPlay: () => void;
  onToggleFavorite: () => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onSelect, onPlay, onToggleFavorite }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onPlay,
    onFocus: onSelect,
  });

  const { isFavorite } = useFavorites();
  const isFav = isFavorite(channel.stream_id);

  return (
    <div
      ref={ref}
      className={classNames('channel-card bg-brand-secondary-dark rounded-lg overflow-hidden', {
        'shadow-glow': focused,
      })}
    >
      <div className="relative channel-card-image-container">
        {channel.stream_icon ? (
          <img src={channel.stream_icon} alt={channel.name} className="w-full h-24 object-cover" />
        ) : (
          <div className="w-full h-24 bg-gray-300 border border-gray-400"></div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 text-white"
        >
          <i className={classNames('fa-heart', { 'fas': isFav, 'far': !isFav })}></i>
        </button>
      </div>
      <p className="text-sm text-brand-light-gray p-2">{channel.name}</p>
    </div>
  );
};
