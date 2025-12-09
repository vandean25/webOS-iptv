import React from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamCategory } from '../types/xtream';
import { Skeleton } from './Skeleton';
import { useLiveStore, FAVORITES_CATEGORY_ID } from '../store/liveStore';

interface CategoryListProps {
  categories: XtreamCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  isLoading?: boolean;
}

const CategoryItem = ({ label, isSelected, onSelect, icon }: { label: string, isSelected: boolean, onSelect: () => void, icon?: React.ReactNode }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });

  return (
    <div
      ref={ref}
      className={classNames(
        'p-3 cursor-pointer rounded transition-colors duration-200 flex items-center space-x-3',
        {
          'bg-primary text-white': focused,
          'bg-surface-light text-gray-300': !focused && !isSelected,
          'bg-gray-700 text-white': isSelected && !focused
        }
      )}
      onClick={onSelect}
    >
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
};

export const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategoryId, onSelectCategory, isLoading }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CATEGORY_LIST',
    trackChildren: true
  });

  const { setSearchActive, isSearchActive } = useLiveStore();

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="h-full overflow-y-auto p-4 space-y-2 bg-surface/90 backdrop-blur-lg w-64 border-r border-gray-800 flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Categories</h2>
        </div>

        {/* Search & Favorites */}
        <div className="space-y-2 mb-4 border-b border-gray-700 pb-4">
            <CategoryItem
                label="Search"
                isSelected={isSearchActive}
                onSelect={handleSearchClick}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                }
            />
            <CategoryItem
                label="Favorites"
                isSelected={selectedCategoryId === FAVORITES_CATEGORY_ID}
                onSelect={() => onSelectCategory(FAVORITES_CATEGORY_ID)}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                }
            />
        </div>

        {isLoading ? (
            <Skeleton className="h-10" count={6} />
        ) : (
            (Array.isArray(categories) ? categories : []).map((cat) => (
            <CategoryItem
                key={cat.category_id}
                label={cat.category_name}
                isSelected={cat.category_id === selectedCategoryId}
                onSelect={() => onSelectCategory(cat.category_id)}
            />
            ))
        )}
      </div>
    </FocusContext.Provider>
  );
};
