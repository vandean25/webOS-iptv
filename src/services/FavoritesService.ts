import type { XtreamStream } from '../types/xtream';

const STORAGE_KEY = 'iptv_favorites';

class FavoritesService {
  private static instance: FavoritesService;
  private listeners: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): FavoritesService {
    if (!FavoritesService.instance) {
      FavoritesService.instance = new FavoritesService();
    }
    return FavoritesService.instance;
  }

  public getFavorites(): XtreamStream[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Filter out legacy ID-only favorites (numbers) and ensure valid objects
      const validFavorites = parsed.filter(item =>
        typeof item === 'object' &&
        item !== null &&
        'stream_id' in item
      );

      // If we filtered out bad data, save the cleaned list back
      if (validFavorites.length !== parsed.length) {
        this.saveFavorites(validFavorites);
      }

      return validFavorites;
    } catch (e) {
      console.error('Failed to parse favorites', e);
      return [];
    }
  }

  private saveFavorites(favorites: XtreamStream[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    this.notifyListeners();
  }

  public addFavorite(channel: XtreamStream) {
    const favorites = this.getFavorites();
    if (!favorites.some(f => f.stream_id === channel.stream_id)) {
      favorites.push(channel);
      this.saveFavorites(favorites);
    }
  }

  public removeFavorite(id: number) {
    let favorites = this.getFavorites();
    favorites = favorites.filter(f => f.stream_id !== id);
    this.saveFavorites(favorites);
  }

  public isFavorite(id: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f => f.stream_id === id);
  }

  public toggleFavorite(channel: XtreamStream) {
    if (this.isFavorite(channel.stream_id)) {
      this.removeFavorite(channel.stream_id);
    } else {
      this.addFavorite(channel);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export default FavoritesService.getInstance();
