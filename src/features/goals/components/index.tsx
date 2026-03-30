import Headline from "@/components/ui/Headline";
import NutritionGoalsSection from "./NutritionGoalsSection";
import MicronutrientsSection from "./MicronutrientsSection";
import FitnessSection from "./FitnessSection";
import MealsCalories from "./MealsCalories";
import WaterGoalSection from "./WaterGoalSection";
import PageWrapper from "@/components/common/PageWrapper";

export default function GoalsPage() {
  return (
    <PageWrapper className="lg:max-w-5xl">
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
    </PageWrapper>
  );
}
