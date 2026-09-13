'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs text-taupe-light mb-2">
        <span>Day {Math.min(current, total)} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-blush-soft/40 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: current >= 30
              ? 'linear-gradient(90deg, #C96F7D, #E7B1B8)'
              : 'linear-gradient(90deg, #8FA58C, #B5C9B2)',
          }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Day ${current} of ${total}`}
        />
      </div>
    </div>
  );
}
