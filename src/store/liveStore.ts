import { create } from 'zustand';
import type { XtreamCategory, XtreamStream, XtreamEPGResponse } from '../types/xtream';
import LiveService from '../services/LiveService';

export const FAVORITES_CATEGORY_ID = 'favorites';

interface LiveState {
  categories: XtreamCategory[];
  channels: XtreamStream[];
  allChannels: XtreamStream[]; // Cache for all channels
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
  enableSearch: () => Promise<void>; // New action to start search
  setSearchActive: (active: boolean) => void;
  setSearchQuery: (query: string) => void; // Kept for compatibility but might delegate to performSearch
  performSearch: (query: string) => void; // New action for filtering
  updateFavorites: () => void;
}

export const useLiveStore = create<LiveState>((set, get) => ({
  categories: [],
  channels: [],
  allChannels: [],
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
             set({ channels: [], isLoadingChannels: false });
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
    selectChannel(channels[nextIndex].stream_id);
  },

  prevChannel: () => {
    const { channels, selectedChannelId, selectChannel } = get();
    if (!channels.length || selectedChannelId === null) return;

    const currentIndex = channels.findIndex(c => c.stream_id === selectedChannelId);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    selectChannel(channels[prevIndex].stream_id);
  },

  reset: () => {
    set({
      categories: [],
      channels: [],
      allChannels: [],
      selectedCategoryId: null,
      selectedChannelId: null,
      epg: null,
      error: null,
      isSearchActive: false,
      searchQuery: ''
    });
  },

  enableSearch: async () => {
      const { allChannels } = get();
      set({ isSearchActive: true, selectedCategoryId: null, channels: [], searchQuery: '' });

      if (allChannels.length === 0) {
          set({ isLoadingChannels: true, error: null });
          try {
              // Fetch all streams (no categoryId provided)
              const streams = await LiveService.getLiveStreams();
              set({ allChannels: streams, isLoadingChannels: false });
          } catch (error: any) {
              set({ error: error.message, isLoadingChannels: false });
          }
      }
  },

  setSearchActive: (active: boolean) => {
      set({ isSearchActive: active });
      if (!active && get().categories.length > 0) {
          // If closing search, maybe re-select the first category or last selected?
          // For now, let's just clear search state.
          // The UI might need to call selectCategory explicitly to go back.
      }
  },

  setSearchQuery: (query: string) => {
      set({ searchQuery: query });
  },

  performSearch: (query: string) => {
      set({ searchQuery: query });
      const { allChannels } = get();

      if (!query.trim()) {
          set({ channels: [] }); // Or show empty if no query
          return;
      }

      const lowerQuery = query.toLowerCase();
      // Filter and limit to 100 results for performance
      const filtered = allChannels
          .filter(c => c.name.toLowerCase().includes(lowerQuery))
          .slice(0, 100);

      set({ channels: filtered });
  },

  updateFavorites: () => {
      // Placeholder
  }
}));
