'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-taupe">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal placeholder:text-taupe-light outline-none transition-all duration-200 min-h-[44px] ${
            error
              ? 'border-rose focus:border-rose focus:ring-2 focus:ring-blush-soft'
              : 'border-blush-soft/60 focus:border-rose focus:ring-2 focus:ring-blush-soft'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-rose" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-taupe-light">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
