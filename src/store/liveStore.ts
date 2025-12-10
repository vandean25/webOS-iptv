import { create } from 'zustand';
import type { XtreamCategory, XtreamStream, XtreamEPGResponse } from '../types/xtream';
import LiveService from '../services/LiveService';
import FavoritesService from '../services/FavoritesService';

export const FAVORITES_CATEGORY_ID = 'favorites';

interface LiveState {
  categories: XtreamCategory[];
  channels: XtreamStream[];
  selectedCategoryId: string | null;
  selectedChannelId: number | null;
  epg: XtreamEPGResponse | null;
  isLoadingCategories: boolean;
  isLoadingChannels: boolean;
  isLoadingEPG: boolean;
  error: string | null;
  isPlayerActive: boolean;
  isSearchActive: boolean;
  searchQuery: string;

  // Actions
  fetchCategories: () => Promise<void>;
  selectCategory: (categoryId: string) => Promise<void>;
  selectChannel: (channelId: number) => void;
  setPlayerActive: (active: boolean) => void;
  nextChannel: () => void;
  prevChannel: () => void;
  reset: () => void;
  setSearchActive: (active: boolean) => void;
  setSearchQuery: (query: string) => void;
  updateFavorites: () => void;
}

export const useLiveStore = create<LiveState>((set, get) => ({
  categories: [],
  channels: [],
  selectedCategoryId: null,
  selectedChannelId: null,
  epg: null,
  isLoadingCategories: false,
  isLoadingChannels: false,
  isLoadingEPG: false,
  error: null,
  isPlayerActive: false,
  isSearchActive: false,
  searchQuery: '',

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
    set({ selectedCategoryId: categoryId, isLoadingChannels: true, error: null, channels: [], isSearchActive: false });
    try {
        if (categoryId === FAVORITES_CATEGORY_ID) {
             const channels = FavoritesService.getFavorites();
             set({ channels, isLoadingChannels: false });
        } else {
             const channels = await LiveService.getLiveStreams(categoryId);
             set({ channels, isLoadingChannels: false });
        }
    } catch (error: any) {
      set({ error: error.message, isLoadingChannels: false });
    }
  },

  selectChannel: (channelId: number) => {
    set({ selectedChannelId: channelId, epg: null, isLoadingEPG: true });
    // Fetch EPG in background
    LiveService.getShortEPG(channelId)
        .then(epg => set({ epg, isLoadingEPG: false }))
        .catch(() => set({ epg: null, isLoadingEPG: false }));
  },

  setPlayerActive: (active: boolean) => {
    set({ isPlayerActive: active });
  },

  nextChannel: () => {
    const { channels, selectedChannelId, selectChannel } = get();
    if (!channels.length || selectedChannelId === null) return;

    const currentIndex = channels.findIndex(c => c.stream_id === selectedChannelId);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % channels.length;
    // Use selectChannel to reuse EPG fetching logic
    selectChannel(channels[nextIndex].stream_id);
  },

  prevChannel: () => {
    const { channels, selectedChannelId, selectChannel } = get();
    if (!channels.length || selectedChannelId === null) return;

    const currentIndex = channels.findIndex(c => c.stream_id === selectedChannelId);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    // Use selectChannel to reuse EPG fetching logic
    selectChannel(channels[prevIndex].stream_id);
  },

  reset: () => {
    set({
      categories: [],
      channels: [],
      selectedCategoryId: null,
      selectedChannelId: null,
      epg: null,
      error: null,
      isSearchActive: false,
      searchQuery: ''
    });
  },

  setSearchActive: (active: boolean) => {
      set({ isSearchActive: active, selectedCategoryId: null });
  },

  setSearchQuery: (query: string) => {
      set({ searchQuery: query });
      // Here one might trigger a search action
  },

  updateFavorites: () => {
      // If currently viewing favorites, reload them
      const state = get();
      if (state.selectedCategoryId === FAVORITES_CATEGORY_ID) {
          const channels = FavoritesService.getFavorites();
          set({ channels });
      }
  }
}));
