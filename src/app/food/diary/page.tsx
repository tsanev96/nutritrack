import dynamic from "next/dynamic";
import CalorieTracker from "@/features/food/components/CalorieTracker";
import PageWrapper from "@/components/common/PageWrapper";
import SkeletonBlock from "@/components/common/SkeletonBlock";

const WaterConsumption = dynamic(
  () => import("@/features/food/components/WaterConsumption"),
  { loading: () => <SkeletonBlock className="mt-4 h-16" /> },
);

export default function FoodDiaryPage() {
  return (
    <PageWrapper>
      <CalorieTracker />
      <WaterConsumption />
    </PageWrapper>
  );
}
