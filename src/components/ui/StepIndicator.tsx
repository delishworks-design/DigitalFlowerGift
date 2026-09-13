'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="relative h-1 bg-blush-soft/40 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-rose rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Dots + labels */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-rose scale-100'
                    : isActive
                    ? 'bg-rose scale-125 ring-2 ring-blush'
                    : 'bg-blush-soft scale-100'
                }`}
                aria-current={isActive ? 'step' : undefined}
              />
              {labels && labels[i] && (
                <span className={`text-[10px] hidden sm:block transition-colors duration-300 ${
                  isActive ? 'text-charcoal font-medium' : isCompleted ? 'text-rose' : 'text-taupe-light'
                }`}>
                  {labels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Step counter */}
      <p className="text-xs text-taupe-light text-center">
        {currentStep} / {totalSteps}
      </p>
    </div>
  );
}
