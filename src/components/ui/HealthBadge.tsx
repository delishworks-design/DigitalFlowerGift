'use client';

import type { HealthState } from '@/types';

interface HealthBadgeProps {
  health: HealthState;
}

export default function HealthBadge({ health }: HealthBadgeProps) {
  const config = {
    healthy: { label: 'Healthy', color: 'bg-sage/10 text-sage border-sage-light/30' },
    thirsty: { label: 'Thirsty', color: 'bg-gold/10 text-gold border-gold-light/30' },
    wilting: { label: 'Needs care', color: 'bg-rose/10 text-rose border-blush/30' },
    reviving: { label: 'Recovering', color: 'bg-lavender-petal/10 text-lavender-petal border-lavender-petal/20' },
  }[health];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}
