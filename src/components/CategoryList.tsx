import React, { useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';
import type { XtreamCategory } from '../types/xtream';

interface CategoryListProps {
  categories: XtreamCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

const CategoryItem = ({ category, isSelected, onSelect }: { category: XtreamCategory, isSelected: boolean, onSelect: () => void }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
    onFocus: onSelect, // Auto-select on focus? Usually better to require Enter, but for categories browsing "peek" is common.
                       // Let's stick to Enter or specialized logic. For now, let's keep it simple: Select on Enter.
                       // Actually, typical TV UI selects category on Focus to update the right pane immediately.
  });

  // Let's implement "Select on Focus" for categories to preview channels immediately
  useEffect(() => {
    if (focused) {
      onSelect();
    }
  }, [focused]);

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

export const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: 'CATEGORY_LIST',
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="h-full overflow-y-auto p-4 space-y-2 bg-surface w-64 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-primary">Categories</h2>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.category_id}
            category={cat}
            isSelected={cat.category_id === selectedCategoryId}
            onSelect={() => onSelectCategory(cat.category_id)}
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
};
