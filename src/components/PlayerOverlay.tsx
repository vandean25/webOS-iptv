import React from 'react';
import type { QualityTags } from '../utils/streamUtils';

interface PlayerOverlayProps {
  tags: QualityTags;
  visible: boolean;
}

export const PlayerOverlay: React.FC<PlayerOverlayProps> = ({ tags, visible }) => {
  if (!visible || (!tags.is4K && !tags.isHEVC && !tags.isFHD)) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 flex space-x-2 z-50 pointer-events-none">
      {tags.is4K && (
        <div className="bg-yellow-500/90 text-black font-bold px-2 py-1 rounded text-xs shadow-lg backdrop-blur-sm border border-yellow-400">
          4K UHD
        </div>
      )}
      {tags.isHEVC && (
        <div className="bg-blue-600/90 text-white font-bold px-2 py-1 rounded text-xs shadow-lg backdrop-blur-sm border border-blue-400">
          HEVC
        </div>
      )}
      {tags.isFHD && (
        <div className="bg-gray-700/90 text-white font-bold px-2 py-1 rounded text-xs shadow-lg backdrop-blur-sm border border-gray-500">
          FHD
        </div>
      )}
    </div>
  );
};
