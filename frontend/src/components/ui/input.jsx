import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';
