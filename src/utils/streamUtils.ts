
export interface QualityTags {
  is4K: boolean;
  isHEVC: boolean;
  isFHD: boolean;
}

export const getVideoCapability = (): boolean => {
  if (typeof document === 'undefined') return false;
  const video = document.createElement('video');
  // Check for HEVC support
  // 'hvc1' is the most common codec tag for HEVC in MP4 container
  return video.canPlayType('video/mp4; codecs="hvc1"') === 'probably' ||
         video.canPlayType('video/mp4; codecs="hvc1"') === 'maybe';
};

export const getStreamQualityTags = (channelName: string): QualityTags => {
  const upperName = channelName.toUpperCase();

  const is4K = upperName.includes('4K') || upperName.includes('UHD');
  const isHEVC = upperName.includes('HEVC') || upperName.includes('H.265');
  const isFHD = upperName.includes('FHD') || upperName.includes('1080');

  return {
    is4K,
    isHEVC,
    isFHD
  };
};
