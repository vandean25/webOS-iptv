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

  public getFavorites(): number[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse favorites', e);
      return [];
    }
  }

  private saveFavorites(favorites: number[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    this.notifyListeners();
  }

  public addFavorite(id: number) {
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      this.saveFavorites(favorites);
    }
  }

  public removeFavorite(id: number) {
    let favorites = this.getFavorites();
    favorites = favorites.filter(favId => favId !== id);
    this.saveFavorites(favorites);
  }

  public isFavorite(id: number): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(id);
  }

  public toggleFavorite(id: number) {
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(id);
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
