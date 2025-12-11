import React from 'react';
import { useLiveStore } from '../store/liveStore';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';

export const MainHeader: React.FC<{ categoryTitle: string }> = ({ categoryTitle }) => {
  const { enableSearch } = useLiveStore();
  const { ref, focused } = useFocusable({
    onEnterPress: () => enableSearch(),
    focusKey: 'SEARCH_BUTTON'
  });

  return (
    <header className="flex justify-between items-center p-6 w-full">
      <h1 className="text-xl text-brand-light-gray font-semibold">{categoryTitle}</h1>
      <div className="flex items-center space-x-6 text-2xl text-brand-light-gray">
        <i className="fas fa-user-circle"></i>
        <button
          ref={ref}
          onClick={enableSearch}
          className={classNames('p-2 rounded-full transition-transform', {
            'text-white scale-110 bg-white/10': focused,
          })}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
    </header>
  );
};
