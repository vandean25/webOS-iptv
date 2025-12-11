import React from 'react';
import Icon from './Icon';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { userInfo } = useAuthStore();
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <header className="z-20 w-full px-8 py-6 flex items-center justify-between bg-gradient-to-b from-background-dark/90 to-transparent sticky top-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-10 rounded-full bg-surface-dark text-primary">
          <Icon icon="spark" className="text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">{title}</h1>
          <p className="text-slate-400 text-sm font-medium">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="px-4 py-2 rounded-lg bg-surface-dark/80 backdrop-blur-sm border border-slate-700/50">
          <span className="text-slate-200 font-bold tracking-wide">{currentTime}</span>
        </div>
        <div className="relative group cursor-pointer">
          <div
            className="size-12 rounded-full ring-2 ring-transparent group-hover:ring-primary transition-all bg-center bg-cover bg-surface-dark flex items-center justify-center"
          >
            <Icon icon="person" className="text-3xl text-slate-400" />
          </div>
          <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-dark"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
