import React from 'react';

export const MainFooter: React.FC = () => {
  return (
    <footer className="w-full mt-auto" data-purpose="app-footer">
      <nav className="flex justify-around items-center bg-brand-dark py-3 border-t border-gray-700">
        <a className="flex flex-col items-center text-brand-light-gray text-xs" href="#">
          <i className="fas fa-home text-xl mb-1"></i>
          <span>Home</span>
        </a>
        <a className="flex flex-col items-center text-brand-light-gray text-xs" href="#">
          <i className="fas fa-tv text-xl mb-1"></i>
          <span>Live TV</span>
        </a>
        <a className="flex flex-col items-center text-brand-light-gray text-xs" href="#">
          <i className="far fa-play-circle text-xl mb-1"></i>
          <span>On Demand</span>
        </a>
        <a className="flex flex-col items-center text-brand-light-gray text-xs" href="#">
          <i className="fas fa-list-ul text-xl mb-1"></i>
          <span>Guide</span>
        </a>
      </nav>
    </footer>
  );
};
