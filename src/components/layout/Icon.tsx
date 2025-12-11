import React from 'react';

interface IconProps {
  icon: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ icon, className, filled }) => {
  const style = filled ? { fontVariationSettings: "'FILL' 1" } : {};

  return (
    <span className={`material-symbols-outlined ${className ?? ''}`} style={style}>
      {icon}
    </span>
  );
};

export default Icon;
