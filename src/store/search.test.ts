import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLiveStore } from './liveStore';
import LiveService from '../services/LiveService';
import type { XtreamStream } from '../types/xtream';

// Mock LiveService
vi.mock('../services/LiveService', () => ({
  default: {
    getLiveCategories: vi.fn(),
    getLiveStreams: vi.fn(),
    getShortEPG: vi.fn(),
  }
}));

describe('useLiveStore Search Logic', () => {
  const mockStreams: XtreamStream[] = [
    { num: 1, stream_id: 1, name: 'CNN US', stream_type: 'live', stream_icon: '', epg_channel_id: '1', added: '', category_id: '1', custom_sid: '', tv_archive: 0, direct_source: '', tv_archive_duration: 0 },
    { num: 2, stream_id: 2, name: 'BBC World', stream_type: 'live', stream_icon: '', epg_channel_id: '2', added: '', category_id: '1', custom_sid: '', tv_archive: 0, direct_source: '', tv_archive_duration: 0 },
    { num: 3, stream_id: 3, name: 'Sky Sports', stream_type: 'live', stream_icon: '', epg_channel_id: '3', added: '', category_id: '2', custom_sid: '', tv_archive: 0, direct_source: '', tv_archive_duration: 0 },
  ];

  beforeEach(() => {
    useLiveStore.getState().reset();
    vi.clearAllMocks();
  });

  it('enableSearch should fetch all channels if not cached', async () => {
    (LiveService.getLiveStreams as any).mockResolvedValue(mockStreams);
    const store = useLiveStore.getState();

    await store.enableSearch();

    const updatedStore = useLiveStore.getState();
    expect(updatedStore.isSearchActive).toBe(true);
    expect(updatedStore.allChannels).toEqual(mockStreams);
    // Initially channels should be empty until query
    expect(updatedStore.channels).toEqual([]);
    expect(LiveService.getLiveStreams).toHaveBeenCalledWith(); // Called without categoryId
  });

  it('enableSearch should not fetch if already cached', async () => {
    useLiveStore.setState({ allChannels: mockStreams });
    const store = useLiveStore.getState();

    await store.enableSearch();

    expect(LiveService.getLiveStreams).not.toHaveBeenCalled();
    const updatedStore = useLiveStore.getState();
    expect(updatedStore.allChannels).toEqual(mockStreams);
  });

  it('performSearch should filter channels correctly', async () => {
    useLiveStore.setState({ allChannels: mockStreams, isSearchActive: true });
    const store = useLiveStore.getState();

    store.performSearch('BBC');

    const updatedStore = useLiveStore.getState();
    expect(updatedStore.searchQuery).toBe('BBC');
    expect(updatedStore.channels).toHaveLength(1);
    expect(updatedStore.channels[0].name).toBe('BBC World');
  });

  it('performSearch should be case insensitive', async () => {
    useLiveStore.setState({ allChannels: mockStreams, isSearchActive: true });
    const store = useLiveStore.getState();

    store.performSearch('cnn');

    const updatedStore = useLiveStore.getState();
    expect(updatedStore.channels).toHaveLength(1);
    expect(updatedStore.channels[0].name).toBe('CNN US');
  });

  it('performSearch should clear channels on empty query', async () => {
    useLiveStore.setState({ allChannels: mockStreams, isSearchActive: true, channels: [mockStreams[0]] });
    const store = useLiveStore.getState();

    store.performSearch('');

    const updatedStore = useLiveStore.getState();
    expect(updatedStore.channels).toHaveLength(0);
  });
});
