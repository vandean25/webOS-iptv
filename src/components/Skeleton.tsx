import React from 'react';
import classNames from 'classnames';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <div className="space-y-2 animate-pulse w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
            key={index}
            className={classNames('bg-gray-700/50 rounded', className)}
        />
      ))}
    </div>
  );
};
