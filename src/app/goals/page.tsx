import Headline from "@/components/common/Headline";
import NutritionGoalsSection from "./_components/NutritionGoalsSection";
import MicronutrientsSection from "./_components/MicronutrientsSection";
import FitnessSection from "./_components/FitnessSection";

export default function Goals() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-lg space-y-4">
        <Headline title="Goals" variant="h1" />
        {/* todo grid */}
        <NutritionGoalsSection />
        <MicronutrientsSection />
        <FitnessSection />
      </div>
    </div>
  );
}
