import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';

interface FocusableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  focusKey?: string;
  label: string;
  className?: string;
}

export const FocusableButton: React.FC<FocusableButtonProps> = ({
  focusKey,
  label,
  className,
  onClick,
  ...props
}) => {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: () => {
        if (onClick) {
            (onClick as any)();
        }
    }
  });

  return (
    <button
      ref={ref}
      className={classNames(
        'px-6 py-3 rounded font-bold transition-all duration-200 uppercase tracking-wide',
        {
          'bg-primary text-white scale-110 shadow-[0_0_20px_rgba(229,9,20,0.5)]': focused,
          'bg-surface text-gray-400': !focused,
        },
        className
      )}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};
