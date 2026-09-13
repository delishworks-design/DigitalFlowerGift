'use client';

import type { HealthState } from '@/types';

interface HealthBadgeProps {
  health: HealthState;
}

export default function HealthBadge({ health }: HealthBadgeProps) {
  const config = {
    healthy: { label: 'Healthy', color: 'bg-green-100 text-green-700', icon: '💚' },
    thirsty: { label: 'Thirsty', color: 'bg-amber-100 text-amber-700', icon: '💧' },
    wilting: { label: 'Wilting', color: 'bg-orange-100 text-orange-700', icon: '🥀' },
    reviving: { label: 'Reviving', color: 'bg-blue-100 text-blue-700', icon: '🌱' },
  }[health];

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
