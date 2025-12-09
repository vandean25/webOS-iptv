import { useState, useEffect } from 'react';
import FavoritesService from '../services/FavoritesService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(FavoritesService.getFavorites());

  useEffect(() => {
    const unsubscribe = FavoritesService.subscribe(() => {
      setFavorites(FavoritesService.getFavorites());
    });
    return unsubscribe;
  }, []);

  const addFavorite = (id: number) => FavoritesService.addFavorite(id);
  const removeFavorite = (id: number) => FavoritesService.removeFavorite(id);
  const toggleFavorite = (id: number) => FavoritesService.toggleFavorite(id);
  const isFavorite = (id: number) => favorites.includes(id);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
};
