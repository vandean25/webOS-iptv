import { useEffect } from 'react';

type KeyMap = {
  [key: string]: () => void;
};

export const useTVRemote = (keyMap: KeyMap, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Standardize key codes
      // WebOS Back: 461
      // Standard Escape: 27
      // Standard Backspace: 8
      let key = event.key;

      if (event.keyCode === 461) key = 'Back';
      if (event.key === 'Escape' || event.key === 'Backspace') key = 'Back';

      // Pass the normalized key or original
      if (keyMap[key]) {
        event.preventDefault(); // Prevent default browser scroll etc
        keyMap[key]();
      } else if (key === 'Back' && keyMap['Back']) {
         event.preventDefault();
         keyMap['Back']();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyMap, isActive]);
};
