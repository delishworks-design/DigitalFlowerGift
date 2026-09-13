'use client';

import type { GrowthStage, HealthState, FlowerType } from '@/types';
import { getFlowerConfig } from '@/lib/flower/config';

interface FlowerVisualProps {
  stage: GrowthStage;
  health: HealthState;
  flowerType: FlowerType;
  isBlooming?: boolean;
}

function getHealthModifier(health: HealthState): string {
  switch (health) {
    case 'thirsty':
      return 'rotate-[5deg] opacity-85';
    case 'wilting':
      return 'rotate-[12deg] opacity-70';
    case 'reviving':
      return 'animate-sway';
    default:
      return '';
  }
}

export default function FlowerVisual({ stage, health, flowerType, isBlooming }: FlowerVisualProps) {
  const config = getFlowerConfig(flowerType);
  const healthMod = getHealthModifier(health);

  return (
    <div className={`relative w-64 h-80 mx-auto ${healthMod}`} role="img" aria-label={`Flower in ${stage} stage`}>
      <svg viewBox="0 0 200 260" className="w-full h-full">
        {/* Soil */}
        <ellipse cx="100" cy="250" rx="60" ry="12" fill="#8B6F47" opacity="0.6" />

        {(stage === 'seed' || stage === 'sprout' || stage === 'young_plant' ||
          stage === 'growing_plant' || stage === 'bud' || stage === 'pre_bloom' ||
          stage === 'bloom' || stage === 'mature') && (
          <>
            {/* Stem */}
            <path
              d={`M100,250 Q100,${stage === 'seed' ? 240 : stage === 'sprout' ? 220 : 180} 100,${stage === 'seed' ? 235 : stage === 'sprout' ? 210 : stage === 'young_plant' ? 170 : 130}`}
              stroke={config.stemColor}
              strokeWidth="3"
              fill="none"
              className="animate-sway"
            />

            {/* Leaves */}
            {(stage === 'young_plant' || stage === 'growing_plant' || stage === 'bud' || stage === 'pre_bloom' || stage === 'bloom' || stage === 'mature') && (
              <>
                <path
                  d="M100,200 Q85,190 80,175 Q90,180 100,185"
                  fill={config.leafColor}
                />
                <path
                  d="M100,195 Q115,185 120,170 Q110,175 100,180"
                  fill={config.leafColor}
                />
              </>
            )}

            {(stage === 'growing_plant' || stage === 'bud' || stage === 'pre_bloom' || stage === 'bloom' || stage === 'mature') && (
              <>
                <path
                  d="M100,175 Q80,165 75,145 Q88,155 100,165"
                  fill={config.leafColor}
                />
                <path
                  d="M100,170 Q120,160 125,140 Q112,150 100,160"
                  fill={config.leafColor}
                />
              </>
            )}

            {/* Bud */}
            {(stage === 'bud' || stage === 'pre_bloom') && (
              <ellipse
                cx="100"
                cy={stage === 'bud' ? 125 : 120}
                rx={stage === 'bud' ? 8 : 12}
                ry={stage === 'bud' ? 10 : 14}
                fill={config.petalColorDark}
                opacity="0.8"
              />
            )}

            {/* Bloom */}
            {(stage === 'bloom' || stage === 'mature') && (
              <g className={isBlooming ? 'animate-bloom' : ''}>
                {/* Petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="100"
                    cy="110"
                    rx="16"
                    ry="24"
                    fill={config.petalColor}
                    transform={`rotate(${angle} 100 110) translate(0 -18)`}
                    opacity="0.9"
                  />
                ))}
                {/* Center */}
                <circle cx="100" cy="110" r="10" fill={config.centerColor} />
              </g>
            )}
          </>
        )}

        {/* Seed */}
        {stage === 'seed' && (
          <ellipse cx="100" cy="240" rx="6" ry="4" fill="#6B5233" />
        )}

        {/* Sprout */}
        {stage === 'sprout' && (
          <>
            <path
              d="M100,240 Q100,225 100,215"
              stroke={config.stemColor}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M100,215 Q95,208 92,200 Q97,205 100,210"
              fill={config.leafColor}
            />
            <path
              d="M100,215 Q105,208 108,200 Q103,205 100,210"
              fill={config.leafColor}
            />
          </>
        )}
      </svg>
    </div>
  );
}
