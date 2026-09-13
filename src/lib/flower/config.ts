import type { FlowerConfig, FlowerType } from '@/types';

export const FLOWER_CONFIGS: Record<FlowerType, FlowerConfig> = {
  rose: {
    id: 'rose',
    name: 'Rose',
    petalColor: '#E8637A',
    petalColorDark: '#C94862',
    centerColor: '#F2A5B3',
    stemColor: '#5B8C5A',
    leafColor: '#6BA368',
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    petalColor: '#F4C430',
    petalColorDark: '#D4A410',
    centerColor: '#8B5E3C',
    stemColor: '#5B8C5A',
    leafColor: '#6BA368',
  },
  tulip: {
    id: 'tulip',
    name: 'Tulip',
    petalColor: '#C850C0',
    petalColorDark: '#A03DA0',
    centerColor: '#E8A0E0',
    stemColor: '#5B8C5A',
    leafColor: '#6BA368',
  },
  daisy: {
    id: 'daisy',
    name: 'Daisy',
    petalColor: '#FFFFFF',
    petalColorDark: '#E8E8E8',
    centerColor: '#F4C430',
    stemColor: '#5B8C5A',
    leafColor: '#6BA368',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    petalColor: '#967BB6',
    petalColorDark: '#7B5EA0',
    centerColor: '#C8A2E8',
    stemColor: '#5B8C5A',
    leafColor: '#6BA368',
  },
};

export function getFlowerConfig(type: FlowerType): FlowerConfig {
  return FLOWER_CONFIGS[type];
}
