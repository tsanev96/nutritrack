import Headline from "@/components/ui/Headline";
import NutritionGoalsSection from "./NutritionGoalsSection";
import MicronutrientsSection from "./MicronutrientsSection";
import FitnessSection from "./FitnessSection";
import MealsCalories from "./MealsCalories";
import WaterGoalSection from "./WaterGoalSection";

export default function GoalsPage() {
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
