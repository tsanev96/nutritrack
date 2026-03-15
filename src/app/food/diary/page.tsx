import CalorieTracker from "@/components/CalorieTracker";
import Headline from "@/components/common/Headline";

export default function FoodDiaryPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <Headline title="Food Diary" />
      <CalorieTracker />
    </main>
  );
}
