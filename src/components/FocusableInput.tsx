import React, { useEffect } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classNames from 'classnames';

interface FocusableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focusKey?: string;
  onEnterPress?: () => void;
  className?: string;
}

export const FocusableInput: React.FC<FocusableInputProps> = ({
  focusKey,
  onEnterPress,
  className,
  onFocus,
  onBlur,
  ...props
}) => {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress,
    onFocus: (layout, props) => {
        onFocus && onFocus(layout as any);
        console.debug('Focused input via Spatial Nav:', props);
    },
    onBlur: (layout, props) => {
        onBlur && onBlur(layout as any);
        console.debug('Blurred input via Spatial Nav:', props);
    },
    isFocusBoundary: false
  });

  // When `focused` becomes true from spatial nav, we should also focus the actual DOM input
  // so that typing works on keyboards (if attached) or just to show cursor.
  useEffect(() => {
    if (focused && ref.current) {
      ref.current.focus();
    }
  }, [focused]);

  return (
    <input
      ref={ref}
      className={classNames(
        'w-full p-4 rounded bg-surface text-text border-2 transition-all duration-200 outline-none',
        {
          'border-primary scale-105 shadow-lg': focused,
          'border-transparent': !focused,
        },
        className
      )}
      {...props}
    />
  );
};
