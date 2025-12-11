import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

interface NavItemProps {
  to: string;
  label: string;
  icon: string;
  focusKey: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, focusKey }) => {
  const { ref, focused } = useFocusable({ focusKey });
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      ref={ref}
      to={to}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all focus:outline-none
        ${isActive ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-white hover:bg-white/10'}
        ${focused ? 'ring-2 ring-white' : ''}`}
    >
      <Icon icon={icon} filled={isActive} />
      <span className="font-bold text-base tracking-wide">{label}</span>
    </NavLink>
  );
};

const BottomNavBar: React.FC = () => {
  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
      <nav className="flex items-center gap-1 bg-surface-dark/95 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-full shadow-2xl pointer-events-auto">
        <NavItem to="/favorites" label="Favorites" icon="star" focusKey="NAV_FAVORITES" />
        <NavItem to="/categories" label="Categories" icon="grid_view" focusKey="NAV_CATEGORIES" />
        <NavItem to="/search" label="Search" icon="search" focusKey="NAV_SEARCH" />
        <button className="flex items-center justify-center size-12 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all focus:ring-2 focus:ring-primary focus:outline-none ml-2 border-l border-slate-700/50">
            <Icon icon="settings" />
        </button>
      </nav>
    </div>
  );
};

export default BottomNavBar;
