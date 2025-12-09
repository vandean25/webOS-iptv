import React from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamCategory } from '../types/xtream';
import { Skeleton } from './Skeleton';

interface CategoryListProps {
  categories: XtreamCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  isLoading?: boolean;
}

const CategoryItem = ({ category, isSelected, onSelect }: { category: XtreamCategory, isSelected: boolean, onSelect: () => void }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });

  return (
    <div
      ref={ref}
      className={classNames(
        'p-3 cursor-pointer rounded transition-colors duration-200',
        {
          'bg-primary text-white': focused,
          'bg-surface-light text-gray-300': !focused && !isSelected,
          'bg-gray-700 text-white': isSelected && !focused
        }
      )}
      onClick={onSelect}
    >
      {category.category_name}
    </div>
  );
};

export const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategoryId, onSelectCategory, isLoading }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CATEGORY_LIST',
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="h-full overflow-y-auto p-4 space-y-2 bg-surface/90 backdrop-blur-lg w-64 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-primary">Categories</h2>
        {isLoading ? (
            <Skeleton className="h-10" count={6} />
        ) : (
            categories.map((cat) => (
            <CategoryItem
                key={cat.category_id}
                category={cat}
                isSelected={cat.category_id === selectedCategoryId}
                onSelect={() => onSelectCategory(cat.category_id)}
            />
            ))
        )}
      </div>
    </FocusContext.Provider>
  );
};
