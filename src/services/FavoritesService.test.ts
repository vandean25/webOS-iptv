import { describe, it, expect, beforeEach, vi } from 'vitest';
import FavoritesService from './FavoritesService';
import { XtreamStream } from '../types/xtream';

const mockChannel: XtreamStream = {
  stream_id: 123,
  name: 'Test Channel',
  stream_type: 'live',
  stream_icon: 'icon.png',
  epg_channel_id: '123',
  added: '2023-01-01',
  category_id: '1',
  custom_sid: '',
  tv_archive: 0,
  direct_source: '',
  tv_archive_duration: 0,
  num: 1
};

const mockChannel2: XtreamStream = {
  ...mockChannel,
  stream_id: 456,
  name: 'Test Channel 2'
};

describe('FavoritesService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty favorites', () => {
    expect(FavoritesService.getFavorites()).toEqual([]);
  });

  it('should add a favorite', () => {
    FavoritesService.addFavorite(mockChannel);
    const favorites = FavoritesService.getFavorites();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].stream_id).toBe(123);
    expect(FavoritesService.isFavorite(123)).toBe(true);
  });

  it('should not add duplicate favorites', () => {
    FavoritesService.addFavorite(mockChannel);
    FavoritesService.addFavorite(mockChannel);
    expect(FavoritesService.getFavorites()).toHaveLength(1);
  });

  it('should remove a favorite', () => {
    FavoritesService.addFavorite(mockChannel);
    FavoritesService.removeFavorite(123);
    expect(FavoritesService.getFavorites()).toEqual([]);
    expect(FavoritesService.isFavorite(123)).toBe(false);
  });

  it('should toggle a favorite', () => {
    FavoritesService.toggleFavorite(mockChannel);
    expect(FavoritesService.isFavorite(123)).toBe(true);

    FavoritesService.toggleFavorite(mockChannel);
    expect(FavoritesService.isFavorite(123)).toBe(false);
  });

  it('should persist to localStorage', () => {
    FavoritesService.addFavorite(mockChannel2);
    const stored = localStorage.getItem('iptv_favorites');
    expect(JSON.parse(stored!)).toHaveLength(1);
    expect(JSON.parse(stored!)[0].stream_id).toBe(456);
  });

  it('should notify subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = FavoritesService.subscribe(listener);

    FavoritesService.addFavorite(mockChannel);
    expect(listener).toHaveBeenCalledTimes(1);

    FavoritesService.removeFavorite(123);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    FavoritesService.addFavorite(mockChannel2);
    expect(listener).toHaveBeenCalledTimes(2); // Should not be called again
  });
});
