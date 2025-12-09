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

  // Actions
  fetchCategories: () => Promise<void>;
  selectCategory: (categoryId: string) => Promise<void>;
  selectChannel: (channelId: number) => void;
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
