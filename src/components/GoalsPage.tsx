"use client";

import Headline from "@/components/common/Headline";
import NutritionGoalsSection from "@/app/goals/_components/NutritionGoalsSection";
import MicronutrientsSection from "@/app/goals/_components/MicronutrientsSection";
import FitnessSection from "@/app/goals/_components/FitnessSection";

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-lg space-y-4">
        <Headline title="Goals" variant="h1" />
        <NutritionGoalsSection />
        <MicronutrientsSection />
        <FitnessSection />
      </div>
    </div>
  );
}
