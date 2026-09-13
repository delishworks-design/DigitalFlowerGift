import { getSupabaseAdmin } from './client';
import type { Reward } from '@/types';

export async function getRewardsForGift(giftId: string): Promise<Reward[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('gift_id', giftId)
    .order('unlocked_at', { ascending: true });

  if (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }

  return (data || []) as Reward[];
}

export async function insertReward(
  giftId: string,
  rewardKey: string
): Promise<Reward | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('rewards')
    .insert({
      gift_id: giftId,
      reward_key: rewardKey,
      unlocked_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return null;
    }
    console.error('Error inserting reward:', error);
    return null;
  }

  return data as Reward;
}
