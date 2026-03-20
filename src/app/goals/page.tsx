import Headline from "@/components/common/Headline";
import NutritionGoalsSection from "./_components/NutritionGoalsSection";
import MicronutrientsSection from "./_components/MicronutrientsSection";
import FitnessSection from "./_components/FitnessSection";
import MealsCalories from "./_components/MealsCalories";
import WaterGoalSection from "./_components/WaterGoalSection";

export default function Goals() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <Headline title="Goals" variant="h1" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <NutritionGoalsSection />
            <MealsCalories />
            <FitnessSection />
            <WaterGoalSection />
          </div>
          <MicronutrientsSection />
        </div>
      </div>
    </div>
  );
}
