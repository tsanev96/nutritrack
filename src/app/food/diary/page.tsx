import CalorieTracker from "@/features/food/components/CalorieTracker";
import WaterConsumption from "@/features/food/components/WaterConsumption";

export default function FoodDiaryPage() {
  return (
    <main className="mx-auto  p-6 py-8 bg-slate-500">
      <CalorieTracker />
      <WaterConsumption />
    </main>
  );
}
