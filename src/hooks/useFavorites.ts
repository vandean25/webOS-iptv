import { useState, useEffect } from 'react';
import FavoritesService from '../services/FavoritesService';
import type { XtreamStream } from '../types/xtream';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<XtreamStream[]>(FavoritesService.getFavorites());

  useEffect(() => {
    const unsubscribe = FavoritesService.subscribe(() => {
      setFavorites(FavoritesService.getFavorites());
    });
    return unsubscribe;
  }, []);

  const addFavorite = (channel: XtreamStream) => FavoritesService.addFavorite(channel);
  const removeFavorite = (id: number) => FavoritesService.removeFavorite(id);
  const toggleFavorite = (channel: XtreamStream) => FavoritesService.toggleFavorite(channel);
  const isFavorite = (id: number) => FavoritesService.isFavorite(id);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
};
