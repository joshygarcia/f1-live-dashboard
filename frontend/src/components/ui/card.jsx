import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-lg border bg-white text-black shadow', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />;
}
