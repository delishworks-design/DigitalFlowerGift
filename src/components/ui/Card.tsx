import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-blush-soft/30 shadow-sm ${
      hover ? 'hover:shadow-md hover:border-blush transition-all duration-300' : ''
    } ${className}`}>
      {children}
    </div>
  );
}
