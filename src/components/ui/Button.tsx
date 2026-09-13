'use client';

import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  arrow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', arrow = false, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 select-none cursor-pointer';

    const variants = {
      primary: 'bg-rose text-white hover:bg-rose-deep shadow-lg hover:shadow-xl shadow-rose/25',
      secondary: 'bg-white text-charcoal hover:bg-cream-deep border-2 border-blush-soft/60 hover:border-blush shadow-sm',
      ghost: 'text-taupe hover:text-charcoal hover:bg-cream-deep',
    };

    const sizes = {
      sm: 'px-4 py-2.5 text-sm min-h-[40px]',
      md: 'px-6 py-3.5 text-base min-h-[48px]',
      lg: 'px-8 py-4 text-lg min-h-[56px]',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
        {arrow && variant === 'primary' && (
          <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
