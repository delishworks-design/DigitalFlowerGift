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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">Milestones</h3>
      <div className="space-y-2">
        {ALL_REWARDS.map((reward) => {
          const unlocked = rewards.includes(reward.key);
          return (
            <div
              key={reward.key}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                unlocked
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
                  : 'bg-gray-50 border border-gray-100 opacity-50'
              }`}
            >
              <span className="text-xl" aria-hidden="true">{reward.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${unlocked ? 'text-green-800' : 'text-gray-400'}`}>
                  {reward.title}
                </p>
                <p className={`text-xs ${unlocked ? 'text-green-600' : 'text-gray-300'}`}>
                  {unlocked ? reward.description : `Day ${reward.day}`}
                </p>
              </div>
              {unlocked && (
                <span className="text-green-500 text-sm" aria-label="Unlocked">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
