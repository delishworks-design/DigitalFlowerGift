import { NextRequest, NextResponse } from 'next/server';
import { careActionSchema } from '@/lib/validation/schemas';
import { getGiftByToken } from '@/lib/db/gifts';
import { getTodayCareEvents, insertCareEvent, getUniqueCareDates, getLastCareDate, getTotalXp } from '@/lib/db/care';
import { getRewardsForGift, insertReward } from '@/lib/db/rewards';
import { calculateFlowerDay, getGrowthStage, getDayLabel } from '@/lib/flower/day';
import { getHealthState } from '@/lib/flower/health';
import { XP_VALUES, DAILY_XP_CAP, calculateDailyXp } from '@/lib/care/xp';
import { calculateStreak } from '@/lib/care/streak';
import { getNewlyUnlockedRewards } from '@/lib/rewards/rewards';
import { getCurrentDate } from '@/lib/time/date';
import { checkRateLimit } from '@/lib/security/rate-limit';
import type { CareType } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Rate limit: 20 care actions per token per minute
    const rl = checkRateLimit(`care:${token}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = careActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid care action.' },
        { status: 400 }
      );
    }

    const gift = await getGiftByToken(token);
    if (!gift) {
      return NextResponse.json(
        { error: 'This flower could not be found.' },
        { status: 404 }
      );
    }

    const timezone = gift.recipient_timezone || 'Asia/Manila';
    const today = getCurrentDate(timezone);
    const todayEvents = await getTodayCareEvents(gift.id, today);
    const todayCareTypes = todayEvents.map((e) => e.care_type) as CareType[];

    if (todayCareTypes.includes(parsed.data.type as CareType)) {
      return NextResponse.json(
        { error: 'This action has already been completed today.' },
        { status: 409 }
      );
    }

    const currentTodayXp = calculateDailyXp(todayEvents);
    const proposedXp = XP_VALUES[parsed.data.type as CareType];
    const xpToAward = Math.min(proposedXp, DAILY_XP_CAP - currentTodayXp);

    if (xpToAward <= 0) {
      return NextResponse.json(
        { error: 'You\'ve earned the maximum XP for today!' },
        { status: 409 }
      );
    }

    const careEvent = await insertCareEvent(gift.id, today, parsed.data.type, xpToAward);
    if (!careEvent) {
      return NextResponse.json(
        { error: 'This action has already been completed today.' },
        { status: 409 }
      );
    }

    const currentDay = calculateFlowerDay(gift.start_date, today);
    const stage = getGrowthStage(currentDay);
    const updatedTodayEvents = await getTodayCareEvents(gift.id, today);
    const updatedTodayXp = calculateDailyXp(updatedTodayEvents);
    const totalXp = await getTotalXp(gift.id);
    const careDates = await getUniqueCareDates(gift.id);
    const streak = calculateStreak(careDates, timezone);
    const lastCareDate = await getLastCareDate(gift.id);
    const health = getHealthState(lastCareDate, today);
    const existingRewards = await getRewardsForGift(gift.id);
    const newlyUnlocked = getNewlyUnlockedRewards(currentDay, existingRewards);

    for (const reward of newlyUnlocked) {
      await insertReward(gift.id, reward.key);
    }

    return NextResponse.json({
      success: true,
      xpAwarded: xpToAward,
      message: getPulseMessage(parsed.data.type as CareType, gift.flower_name),
      currentDay,
      stage,
      stageLabel: getDayLabel(stage),
      health,
      totalXp,
      streak,
      todayCare: updatedTodayEvents.map((e) => e.care_type) as CareType[],
      todayXp: updatedTodayXp,
      newlyUnlocked,
    });
  } catch {
    return NextResponse.json(
      { error: 'We couldn\'t save that right now. Please try again.' },
      { status: 500 }
    );
  }
}

function getPulseMessage(type: CareType, flowerName: string): string {
  switch (type) {
    case 'water':
      return `${flowerName} looks happier!`;
    case 'sunlight':
      return `${flowerName} enjoyed the sunshine!`;
    case 'love':
      return `${flowerName} felt the love!`;
    default:
      return `${flowerName} appreciates your care!`;
  }
}
