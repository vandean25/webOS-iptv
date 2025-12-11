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

const CategoryItem = ({ label, isSelected, onSelect }: { label: string, isSelected: boolean, onSelect: () => void }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });

  return (
    <li>
      <button
        ref={ref}
        onClick={onSelect}
        className={classNames(
          'block w-full text-left py-3 px-4 font-bold tracking-wider rounded-md',
          {
            'bg-white text-black': focused || isSelected,
            'bg-brand-gray': !focused && !isSelected,
          }
        )}
      >
        {label}
      </button>
    </li>
  );
};

export const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategoryId, onSelectCategory, isLoading }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CATEGORY_LIST',
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <aside ref={ref} className="w-1/4 max-w-xs pr-6" data-purpose="category-sidebar">
        <nav>
          {isLoading ? (
            <Skeleton className="h-12" count={10} />
          ) : (
            <ul className="space-y-2">
              <CategoryItem
                label="ALL CHANNELS"
                isSelected={selectedCategoryId === 'all'}
                onSelect={() => onSelectCategory('all')}
              />
              <CategoryItem
                label="FAVORITES"
                isSelected={selectedCategoryId === FAVORITES_CATEGORY_ID}
                onSelect={() => onSelectCategory(FAVORITES_CATEGORY_ID)}
              />
              {(Array.isArray(categories) ? categories : []).map((cat) => (
                <CategoryItem
                  key={cat.category_id}
                  label={cat.category_name.toUpperCase()}
                  isSelected={cat.category_id === selectedCategoryId}
                  onSelect={() => onSelectCategory(cat.category_id)}
                />
              ))}
            </ul>
          )}
        </nav>
      </aside>
    </FocusContext.Provider>
  );
};
