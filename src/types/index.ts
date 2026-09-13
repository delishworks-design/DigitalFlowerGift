export type FlowerType = 'rose' | 'sunflower' | 'tulip' | 'daisy' | 'lavender';

export type CareType = 'water' | 'sunlight' | 'love';

export type GrowthStage =
  | 'seed'
  | 'sprout'
  | 'young_plant'
  | 'growing_plant'
  | 'bud'
  | 'pre_bloom'
  | 'bloom'
  | 'mature';

export type HealthState = 'healthy' | 'thirsty' | 'wilting' | 'reviving';

export interface Gift {
  id: string;
  public_token: string;
  recipient_name: string;
  giver_name: string | null;
  flower_type: FlowerType;
  flower_name: string;
  personal_message: string;
  bloom_message: string;
  start_date: string;
  recipient_timezone: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface CareEvent {
  id: string;
  gift_id: string;
  care_date: string;
  care_type: CareType;
  xp_awarded: number;
  created_at: string;
}

export interface Reward {
  id: string;
  gift_id: string;
  reward_key: string;
  unlocked_at: string;
}

export interface FlowerState {
  gift: Gift;
  currentDay: number;
  stage: GrowthStage;
  health: HealthState;
  totalXp: number;
  streak: number;
  rewards: Reward[];
  todayCare: CareType[];
  todayXp: number;
  isBlooming: boolean;
  isFuture: boolean;
}

export interface RewardDefinition {
  key: string;
  day: number;
  title: string;
  description: string;
  icon: string;
}

export interface FlowerConfig {
  id: FlowerType;
  name: string;
  petalColor: string;
  petalColorDark: string;
  centerColor: string;
  stemColor: string;
  leafColor: string;
}
