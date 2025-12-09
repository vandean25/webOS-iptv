import { describe, it, expect, beforeEach, vi } from 'vitest';
import FavoritesService from './FavoritesService';

describe('FavoritesService', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorage.clear();
    // Reset the singleton instance state if possible, or just rely on localStorage
    // Since service reads from localStorage on every get, clearing LS is enough?
    // The service has no internal state cache for the list, it reads from LS.
    // Wait, the service implementation:
    // private getFavorites() { ... return stored ? JSON.parse(stored) : []; }
    // It doesn't cache in a variable. Good.
  });

  it('should start with empty favorites', () => {
    expect(FavoritesService.getFavorites()).toEqual([]);
  });

  it('should add a favorite', () => {
    FavoritesService.addFavorite(123);
    expect(FavoritesService.getFavorites()).toEqual([123]);
    expect(FavoritesService.isFavorite(123)).toBe(true);
  });

  it('should not add duplicate favorites', () => {
    FavoritesService.addFavorite(123);
    FavoritesService.addFavorite(123);
    expect(FavoritesService.getFavorites()).toEqual([123]);
  });

  it('should remove a favorite', () => {
    FavoritesService.addFavorite(123);
    FavoritesService.removeFavorite(123);
    expect(FavoritesService.getFavorites()).toEqual([]);
    expect(FavoritesService.isFavorite(123)).toBe(false);
  });

  it('should toggle a favorite', () => {
    FavoritesService.toggleFavorite(123);
    expect(FavoritesService.isFavorite(123)).toBe(true);

    FavoritesService.toggleFavorite(123);
    expect(FavoritesService.isFavorite(123)).toBe(false);
  });

  it('should persist to localStorage', () => {
    FavoritesService.addFavorite(456);
    const stored = localStorage.getItem('iptv_favorites');
    expect(stored).toBe(JSON.stringify([456]));
  });

  it('should notify subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = FavoritesService.subscribe(listener);

    FavoritesService.addFavorite(789);
    expect(listener).toHaveBeenCalledTimes(1);

    FavoritesService.removeFavorite(789);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    FavoritesService.addFavorite(999);
    expect(listener).toHaveBeenCalledTimes(2); // Should not be called again
  });
});
