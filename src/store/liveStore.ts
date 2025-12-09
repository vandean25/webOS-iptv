import { create } from 'zustand';
import type { XtreamCategory, XtreamStream } from '../types/xtream';
import LiveService from '../services/LiveService';

interface LiveState {
  categories: XtreamCategory[];
  channels: XtreamStream[];
  selectedCategoryId: string | null;
  selectedChannelId: number | null;
  isLoadingCategories: boolean;
  isLoadingChannels: boolean;
  error: string | null;
  isPlayerActive: boolean;

  // Actions
  fetchCategories: () => Promise<void>;
  selectCategory: (categoryId: string) => Promise<void>;
  selectChannel: (channelId: number) => void;
  setPlayerActive: (active: boolean) => void;
  nextChannel: () => void;
  prevChannel: () => void;
  reset: () => void;
}

export const useLiveStore = create<LiveState>((set, get) => ({
  categories: [],
  channels: [],
  selectedCategoryId: null,
  selectedChannelId: null,
  isLoadingCategories: false,
  isLoadingChannels: false,
  error: null,
  isPlayerActive: false,

  fetchCategories: async () => {
    set({ isLoadingCategories: true, error: null });
    try {
      const categories = await LiveService.getLiveCategories();
      set({ categories, isLoadingCategories: false });

      // Auto-select first category if available
      if (categories.length > 0) {
        get().selectCategory(categories[0].category_id);
      }
    } catch (error: any) {
      set({ error: error.message, isLoadingCategories: false });
    }
  },

  selectCategory: async (categoryId: string) => {
    set({ selectedCategoryId: categoryId, isLoadingChannels: true, error: null, channels: [] });
    try {
      const channels = await LiveService.getLiveStreams(categoryId);
      set({ channels, isLoadingChannels: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingChannels: false });
    }
  },

  selectChannel: (channelId: number) => {
    set({ selectedChannelId: channelId });
  },

  setPlayerActive: (active: boolean) => {
    set({ isPlayerActive: active });
  },

  nextChannel: () => {
    const { channels, selectedChannelId } = get();
    if (!channels.length || selectedChannelId === null) return;

    const currentIndex = channels.findIndex(c => c.stream_id === selectedChannelId);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % channels.length;
    set({ selectedChannelId: channels[nextIndex].stream_id });
  },

  prevChannel: () => {
    const { channels, selectedChannelId } = get();
    if (!channels.length || selectedChannelId === null) return;

    const currentIndex = channels.findIndex(c => c.stream_id === selectedChannelId);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    set({ selectedChannelId: channels[prevIndex].stream_id });
  },

  reset: () => {
    set({
      categories: [],
      channels: [],
      selectedCategoryId: null,
      selectedChannelId: null,
      error: null
    });
  }
}));
