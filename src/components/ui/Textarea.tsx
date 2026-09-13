'use client';

import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, hint, id, maxLength, value, charCount, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-taupe">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          value={value}
          className={`w-full px-4 py-3 rounded-xl border bg-white text-charcoal placeholder:text-taupe-light outline-none transition-all duration-200 resize-none min-h-[100px] ${
            error
              ? 'border-rose focus:border-rose focus:ring-2 focus:ring-blush-soft'
              : 'border-blush-soft/60 focus:border-rose focus:ring-2 focus:ring-blush-soft'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div>
            {error && <p id={`${id}-error`} className="text-sm text-rose" role="alert">{error}</p>}
            {hint && !error && <p id={`${id}-hint`} className="text-xs text-taupe-light">{hint}</p>}
          </div>
          {charCount && maxLength && (
            <span className="text-xs text-taupe-light ml-auto">{currentLength}/{maxLength}</span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
