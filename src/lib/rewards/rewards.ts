import type { Reward, RewardDefinition } from '@/types';

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  {
    key: 'first_steps',
    day: 3,
    title: 'First Steps',
    description: 'You helped your flower take its first steps.',
    icon: '🌱',
  },
  {
    key: 'one_week',
    day: 7,
    title: 'One Week Together',
    description: 'Seven days of caring.',
    icon: '🌿',
  },
  {
    key: 'first_bud',
    day: 14,
    title: 'First Bud',
    description: 'A bud begins to form.',
    icon: '🌼',
  },
  {
    key: 'almost_there',
    day: 21,
    title: 'Almost There',
    description: 'The bloom is near.',
    icon: '🌺',
  },
  {
    key: 'first_bloom',
    day: 30,
    title: 'First Bloom',
    description: 'Thirty days together.',
    icon: '🌸',
  },
];

export function getUnlockedRewards(day: number): RewardDefinition[] {
  return REWARD_DEFINITIONS.filter((r) => day >= r.day);
}

export function getNewlyUnlockedRewards(
  day: number,
  existingRewards: Reward[]
): RewardDefinition[] {
  const existingKeys = new Set(existingRewards.map((r) => r.reward_key));
  return getUnlockedRewards(day).filter((r) => !existingKeys.has(r.key));
}
