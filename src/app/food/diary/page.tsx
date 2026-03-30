import CalorieTracker from "@/features/food/components/CalorieTracker";
import WaterConsumption from "@/features/food/components/WaterConsumption";
import PageWrapper from "@/components/common/PageWrapper";

export default function FoodDiaryPage() {
  return (
    <PageWrapper>
      <CalorieTracker />
      <WaterConsumption />
    </PageWrapper>
  );
}
