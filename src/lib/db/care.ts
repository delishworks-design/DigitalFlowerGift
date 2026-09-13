import { getSupabaseAdmin } from './client';
import type { CareEvent } from '@/types';

export async function getCareEventsForGift(giftId: string): Promise<CareEvent[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('gift_id', giftId)
    .order('care_date', { ascending: false });

  if (error) {
    console.error('Error fetching care events:', error);
    return [];
  }

  return (data || []) as CareEvent[];
}

export async function getTodayCareEvents(
  giftId: string,
  today: string
): Promise<CareEvent[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('gift_id', giftId)
    .eq('care_date', today);

  if (error) {
    console.error('Error fetching today care events:', error);
    return [];
  }

  return (data || []) as CareEvent[];
}

export async function insertCareEvent(
  giftId: string,
  careDate: string,
  careType: string,
  xpAwarded: number
): Promise<CareEvent | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('care_events')
    .insert({
      gift_id: giftId,
      care_date: careDate,
      care_type: careType,
      xp_awarded: xpAwarded,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return null;
    }
    console.error('Error inserting care event:', error);
    throw new Error('We couldn\'t save that right now. Please try again.');
  }

  return data as CareEvent;
}

export async function getUniqueCareDates(giftId: string): Promise<string[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('care_events')
    .select('care_date')
    .eq('gift_id', giftId)
    .order('care_date', { ascending: false });

  if (error) return [];

  const uniqueDates = [...new Set((data || []).map((e) => e.care_date))];
  return uniqueDates;
}

export async function getLastCareDate(giftId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('care_events')
    .select('care_date')
    .eq('gift_id', giftId)
    .order('care_date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  return data.care_date;
}

export async function getTotalXp(giftId: string): Promise<number> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('care_events')
    .select('xp_awarded')
    .eq('gift_id', giftId);

  if (error) return 0;

  return (data || []).reduce((sum: number, e: { xp_awarded: number }) => sum + e.xp_awarded, 0);
}
