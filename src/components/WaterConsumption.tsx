"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import Headline from "./common/Headline";
import { getTodayDate } from "@/utils/dates";
import Paragraph from "./common/Paragraph";

type Props = Readonly<{
  date?: string;
}>;

export default function WaterConsumption({ date }: Props) {
  const waterConsumed = useTrackerStore(
    (s) => s.logs[date ?? getTodayDate()]?.water,
  );
  const waterGoal = useTrackerStore((s) => s.waterGoals);

  return (
    <div>
      <Headline title="Water Consumption" variant="h2" color="white" />
      <Paragraph variant="sm" color="white">
        Track your daily water intake to stay hydrated and support your overall
        health. Aim for at least 8 glasses (about 2 liters) of water per day,
        but remember that individual needs may vary based on factors like
        activity level, climate, and overall health.
      </Paragraph>
      <Paragraph variant="base" color="white">
        Your daily water intake: {waterConsumed ?? 0} ml
      </Paragraph>
      <Paragraph variant="base" color="white">
        Water goal: {waterGoal} ml
      </Paragraph>
    </div>
  );
}
