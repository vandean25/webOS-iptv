import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { VideoPlayer } from './VideoPlayer';
import * as streamUtils from '../utils/streamUtils';

// Mock video.js
vi.mock('video.js', () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      dispose: vi.fn(),
    })),
  };
});

// Mock PlayerOverlay to avoid testing child component details
vi.mock('./PlayerOverlay', () => ({
  PlayerOverlay: () => <div data-testid="player-overlay" />,
}));

describe('VideoPlayer HEVC/4K Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use NATIVE mode for 4K/HEVC streams when device supports it', () => {
    // 1. Mock capabilities to return TRUE for HEVC
    vi.spyOn(streamUtils, 'getVideoCapability').mockReturnValue(true);

    // 2. Mock tags to simulate a 4K HEVC channel
    vi.spyOn(streamUtils, 'getStreamQualityTags').mockReturnValue({
      is4K: true,
      isHEVC: true,
      isFHD: false,
      isHD: false,
      isSD: false
    });

    // 3. Render the player with a mock channel name
    const { getByText } = render(
      <VideoPlayer
        src="http://test.com/stream.m3u8"
        channelName="[4K] [HEVC] Test Channel"
      />
    );

    // 4. Assert that the Debug Indicator shows NATIVE
    expect(getByText('DEBUG MODE: NATIVE (WebOS)')).toBeTruthy();
  });

  it('should use VHS (Hls.js) mode for standard streams', () => {
    // 1. Mock capabilities
    vi.spyOn(streamUtils, 'getVideoCapability').mockReturnValue(true);

    // 2. Mock tags to simulate a standard channel
    vi.spyOn(streamUtils, 'getStreamQualityTags').mockReturnValue({
      is4K: false,
      isHEVC: false,
      isFHD: true,
      isHD: false,
      isSD: false
    });

    // 3. Render
    const { getByText } = render(
      <VideoPlayer
        src="http://test.com/stream.m3u8"
        channelName="Standard Channel"
      />
    );

    // 4. Assert
    expect(getByText('DEBUG MODE: VHS (Hls.js)')).toBeTruthy();
  });

  it('should fallback to VHS if device does NOT support HEVC, even for 4K streams', () => {
    // 1. Mock capabilities to return FALSE
    vi.spyOn(streamUtils, 'getVideoCapability').mockReturnValue(false);

    // 2. Mock tags for 4K
    vi.spyOn(streamUtils, 'getStreamQualityTags').mockReturnValue({
      is4K: true,
      isHEVC: true,
      isFHD: false,
      isHD: false,
      isSD: false
    });

    // 3. Render
    const { getByText } = render(
      <VideoPlayer
        src="http://test.com/stream.m3u8"
        channelName="[4K] Test"
      />
    );

    // 4. Assert fallback
    expect(getByText('DEBUG MODE: VHS (Hls.js)')).toBeTruthy();
  });
});
