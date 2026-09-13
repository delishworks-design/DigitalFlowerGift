'use client';

import type { RewardDefinition } from '@/types';

interface RewardsListProps {
  rewards: string[];
}

const ALL_REWARDS: RewardDefinition[] = [
  { key: 'first_steps', day: 3, title: 'First Steps', description: 'You helped your flower take its first steps.', icon: '🌱' },
  { key: 'one_week', day: 7, title: 'One Week Together', description: 'Seven days of caring.', icon: '🌿' },
  { key: 'first_bud', day: 14, title: 'First Bud', description: 'A bud begins to form.', icon: '🌼' },
  { key: 'almost_there', day: 21, title: 'Almost There', description: 'The bloom is near.', icon: '🌺' },
  { key: 'first_bloom', day: 30, title: 'First Bloom', description: 'Thirty days together.', icon: '🌸' },
];

export default function RewardsList({ rewards }: RewardsListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs text-taupe-light uppercase tracking-wide">Milestones</h3>
      <div className="space-y-2">
        {ALL_REWARDS.map((reward) => {
          const unlocked = rewards.includes(reward.key);
          return (
            <div
              key={reward.key}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                unlocked
                  ? 'bg-warm-blush/40 border border-blush/20'
                  : 'bg-cream-deep/50 border border-transparent opacity-40'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{reward.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${unlocked ? 'text-charcoal' : 'text-taupe-light'}`}>
                  {reward.title}
                </p>
                <p className={`text-xs ${unlocked ? 'text-taupe' : 'text-taupe-light'}`}>
                  {unlocked ? reward.description : `Day ${reward.day}`}
                </p>
              </div>
              {unlocked && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#8FA58C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
