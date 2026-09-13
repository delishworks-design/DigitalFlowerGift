'use client';

import { useEffect, useState } from 'react';
import type { GrowthStage, HealthState, FlowerType } from '@/types';
import { getFlowerConfig } from '@/lib/flower/config';

interface FlowerVisualProps {
  stage: GrowthStage;
  health: HealthState;
  flowerType: FlowerType;
  isBlooming?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showParticles?: boolean;
}

function getHealthModifier(health: HealthState): string {
  switch (health) {
    case 'thirsty': return 'opacity-80';
    case 'wilting': return 'opacity-65';
    case 'reviving': return 'animate-sway';
    default: return '';
  }
}

function getStemHeight(stage: GrowthStage): number {
  switch (stage) {
    case 'seed': return 245;
    case 'sprout': return 225;
    case 'young_plant': return 180;
    case 'growing_plant': return 145;
    case 'bud': return 130;
    case 'pre_bloom': return 120;
    case 'bloom': return 115;
    case 'mature': return 115;
    default: return 245;
  }
}

function getHeadY(stage: GrowthStage): number {
  switch (stage) {
    case 'seed': return 240;
    case 'sprout': return 215;
    case 'young_plant': return 170;
    case 'growing_plant': return 135;
    case 'bud': return 120;
    case 'pre_bloom': return 112;
    case 'bloom': return 105;
    case 'mature': return 105;
    default: return 240;
  }
}

export default function FlowerVisual({ stage, health, flowerType, isBlooming, size = 'md', showParticles = false }: FlowerVisualProps) {
  const config = getFlowerConfig(flowerType);
  const healthMod = getHealthModifier(health);
  const stemHeight = getStemHeight(stage);
  const headY = getHeadY(stage);

  const [petalVisible, setPetalVisible] = useState(false);
  useEffect(() => {
    if (isBlooming) {
      const t = setTimeout(() => setPetalVisible(true), 300);
      return () => clearTimeout(t);
    }
    setPetalVisible(false);
  }, [isBlooming]);

  const sizeClasses = {
    sm: 'w-40 h-52',
    md: 'w-56 h-72',
    lg: 'w-72 h-92',
    xl: 'w-80 h-[340px]',
  };

  return (
    <div className={`relative mx-auto ${sizeClasses[size]} ${healthMod}`} role="img" aria-label={`${flowerType} in ${stage} stage`}>
      {/* Particles for bloom */}
      {showParticles && petalVisible && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-petal"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: '20%',
                animationDelay: `${i * 0.4}s`,
                opacity: 0.7,
              }}
            >
              <svg width="8" height="10" viewBox="0 0 8 10">
                <ellipse cx="4" cy="5" rx="3.5" ry="5" fill={config.petalColor} opacity="0.6" />
              </svg>
            </div>
          ))}
        </div>
      )}

      <svg viewBox="0 0 200 260" className="w-full h-full">
        {/* Soft soil */}
        <ellipse cx="100" cy="252" rx="55" ry="10" fill="#8B6F47" opacity="0.3" />
        <ellipse cx="100" cy="250" rx="45" ry="7" fill="#8B6F47" opacity="0.15" />

        {/* Stem */}
        {stage !== 'seed' && (
          <path
            d={`M100,250 Q100,${(250 + stemHeight) / 2} 100,${stemHeight}`}
            stroke={config.stemColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="animate-sway"
            style={{ transformOrigin: '100px 250px' }}
          />
        )}

        {/* Leaves — young_plant+ */}
        {(stage === 'young_plant' || stage === 'growing_plant' || stage === 'bud' || stage === 'pre_bloom' || stage === 'bloom' || stage === 'mature') && (
          <g>
            <path d={`M100,${stemHeight + 30} Q82,${stemHeight + 18} 78,${stemHeight + 2}`} fill={config.leafColor} opacity="0.9" />
            <path d={`M100,${stemHeight + 25} Q118,${stemHeight + 13} 122,${stemHeight - 3}`} fill={config.leafColor} opacity="0.9" />
          </g>
        )}

        {/* Extra leaves — growing_plant+ */}
        {(stage === 'growing_plant' || stage === 'bud' || stage === 'pre_bloom' || stage === 'bloom' || stage === 'mature') && (
          <g>
            <path d={`M100,${stemHeight + 55} Q78,${stemHeight + 42} 74,${stemHeight + 22}`} fill={config.leafColor} opacity="0.85" />
            <path d={`M100,${stemHeight + 50} Q122,${stemHeight + 37} 126,${stemHeight + 17}`} fill={config.leafColor} opacity="0.85" />
          </g>
        )}

        {/* Seed */}
        {stage === 'seed' && (
          <g className="animate-pulse-soft">
            <ellipse cx="100" cy="242" rx="6" ry="4.5" fill="#6B5233" />
            <ellipse cx="99" cy="241" rx="2" ry="1.5" fill="#8B6F47" opacity="0.5" />
          </g>
        )}

        {/* Sprout leaves */}
        {stage === 'sprout' && (
          <g>
            <path d="M100,215 Q95,206 90,198 Q96,204 100,210" fill={config.leafColor} />
            <path d="M100,215 Q105,206 110,198 Q104,204 100,210" fill={config.leafColor} />
          </g>
        )}

        {/* Bud */}
        {(stage === 'bud' || stage === 'pre_bloom') && (
          <g className="animate-pulse-soft">
            <ellipse
              cx="100"
              cy={headY}
              rx={stage === 'bud' ? 8 : 13}
              ry={stage === 'bud' ? 11 : 16}
              fill={config.petalColorDark}
              opacity="0.85"
            />
            {stage === 'pre_bloom' && (
              <>
                <ellipse cx="100" cy={headY - 2} rx="10" ry="12" fill={config.petalColor} opacity="0.3" />
                <ellipse cx="100" cy={headY - 1} rx="7" ry="9" fill={config.petalColor} opacity="0.5" />
              </>
            )}
          </g>
        )}

        {/* Bloom */}
        {(stage === 'bloom' || stage === 'mature') && (
          <g className={isBlooming && petalVisible ? 'animate-bloom' : ''}>
            {/* Outer petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={`outer-${angle}`}
                cx="100"
                cy={headY}
                rx="16"
                ry="24"
                fill={config.petalColor}
                transform={`rotate(${angle} 100 ${headY}) translate(0 -18)`}
                opacity={petalVisible ? 0.85 : 0.6}
                style={{ transition: 'opacity 0.5s ease', transitionDelay: `${i * 60}ms` }}
              />
            ))}
            {/* Inner petals */}
            {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => (
              <ellipse
                key={`inner-${angle}`}
                cx="100"
                cy={headY}
                rx="11"
                ry="17"
                fill={config.petalColor}
                transform={`rotate(${angle} 100 ${headY}) translate(0 -12)`}
                opacity={petalVisible ? 0.7 : 0.4}
                style={{ transition: 'opacity 0.5s ease', transitionDelay: `${200 + i * 50}ms` }}
              />
            ))}
            {/* Center */}
            <circle cx="100" cy={headY} r="9" fill={config.centerColor} />
            <circle cx="100" cy={headY} r="5" fill={config.centerColor} opacity="0.7" />
            {/* Center dots */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <circle
                key={`dot-${angle}`}
                cx={100 + Math.cos((angle * Math.PI) / 180) * 4}
                cy={headY + Math.sin((angle * Math.PI) / 180) * 4}
                r="1"
                fill={config.petalColorDark}
                opacity="0.4"
              />
            ))}
          </g>
        )}

        {/* Bloom glow effect */}
        {(stage === 'bloom' || stage === 'mature') && isBlooming && petalVisible && (
          <circle
            cx="100"
            cy={headY}
            r="35"
            fill="none"
            stroke={config.petalColor}
            strokeWidth="0.5"
            opacity="0.3"
            className="animate-pulse-soft"
          />
        )}
      </svg>
    </div>
  );
}
