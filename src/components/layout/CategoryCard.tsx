import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Icon from './Icon';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon?: string; // Optional icon for the category
  };
  onEnterPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEnterPress }) => {
  const { ref, focused } = useFocusable({ onEnterPress });

  return (
    <div
      ref={ref}
      className={`tv-card group relative flex flex-col gap-3 p-1 rounded-xl cursor-pointer focus:outline-none transition-transform duration-300 ${focused ? 'scale-105 z-10' : ''}`}
      tabIndex={-1}
    >
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-xl bg-surface-dark shadow-lg ring-offset-4 ring-offset-background-dark transition-all duration-300 ${focused ? 'ring-4 ring-primary' : ''} flex items-center justify-center`}
      >
        <Icon icon={category.icon || 'folder'} className="text-6xl text-slate-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <h3 className="absolute bottom-4 text-2xl font-bold text-white leading-tight z-10">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
