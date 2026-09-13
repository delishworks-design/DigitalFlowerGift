import { NextRequest, NextResponse } from 'next/server';
import { getGiftByToken } from '@/lib/db/gifts';
import {
  getTodayCareEvents,
  getUniqueCareDates,
  getLastCareDate,
  getTotalXp,
} from '@/lib/db/care';
import { getRewardsForGift } from '@/lib/db/rewards';
import { calculateFlowerDay, getGrowthStage, getDayLabel } from '@/lib/flower/day';
import { getHealthState } from '@/lib/flower/health';
import { calculateDailyXp } from '@/lib/care/xp';
import { calculateStreak } from '@/lib/care/streak';
import { getNewlyUnlockedRewards } from '@/lib/rewards/rewards';
import { getCurrentDate } from '@/lib/time/date';
import type { CareType } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const gift = await getGiftByToken(token);

    if (!gift) {
      return NextResponse.json(
        { error: 'This flower could not be found.' },
        { status: 404 }
      );
    }

    const timezone = gift.recipient_timezone || 'Asia/Manila';
    const today = getCurrentDate(timezone);
    const currentDay = calculateFlowerDay(gift.start_date, today);
    const stage = getGrowthStage(currentDay);
    const todayEvents = await getTodayCareEvents(gift.id, today);
    const todayCareTypes = todayEvents.map((e) => e.care_type) as CareType[];
    const todayXp = calculateDailyXp(todayEvents);
    const totalXp = await getTotalXp(gift.id);
    const careDates = await getUniqueCareDates(gift.id);
    const streak = calculateStreak(careDates, timezone);
    const lastCareDate = await getLastCareDate(gift.id);
    const health = getHealthState(lastCareDate, today);
    const existingRewards = await getRewardsForGift(gift.id);
    const newlyUnlocked = getNewlyUnlockedRewards(currentDay, existingRewards);

    const isFuture = new Date(gift.start_date + 'T00:00:00Z') > new Date(today + 'T00:00:00Z');

    return NextResponse.json({
      gift: {
        id: gift.id,
        recipientName: gift.recipient_name,
        giverName: gift.giver_name,
        flowerType: gift.flower_type,
        flowerName: gift.flower_name,
        personalMessage: gift.personal_message,
        bloomMessage: gift.bloom_message,
        startDate: gift.start_date,
      },
      currentDay,
      stage,
      stageLabel: getDayLabel(stage),
      health,
      totalXp,
      streak,
      todayCare: todayCareTypes,
      todayXp,
      isBlooming: currentDay >= 30,
      isFuture,
      rewards: [...existingRewards.map(r => r.reward_key), ...newlyUnlocked.map(r => r.key)],
      newlyUnlocked,
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
