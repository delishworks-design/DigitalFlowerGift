import type { GrowthStage } from '@/types';

export function calculateFlowerDay(startDate: string, currentDate: string): number {
  const start = new Date(startDate + 'T00:00:00Z');
  const current = new Date(currentDate + 'T00:00:00Z');
  const diffMs = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getGrowthStage(day: number): GrowthStage {
  if (day <= 0) return 'seed';
  if (day <= 3) return 'sprout';
  if (day <= 7) return 'young_plant';
  if (day <= 14) return 'growing_plant';
  if (day <= 21) return 'bud';
  if (day <= 29) return 'pre_bloom';
  if (day === 30) return 'bloom';
  return 'mature';
}

export function getDayLabel(stage: GrowthStage): string {
  const labels: Record<GrowthStage, string> = {
    seed: 'Seed',
    sprout: 'Sprout',
    young_plant: 'Young Plant',
    growing_plant: 'Growing Plant',
    bud: 'Bud',
    pre_bloom: 'Pre-Bloom',
    bloom: 'Bloom',
    mature: 'Mature Flower',
  };
  return labels[stage];
}
