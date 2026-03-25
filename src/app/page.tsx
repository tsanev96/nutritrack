import CalorieTracker from "@/components/CalorieTracker";
import Headline from "@/components/Headline";

export default function Home() {
  return (
    <section>
      <Headline title="Welcome to the Calorie Tracker App!" />
      <p className="mt-4 text-lg text-gray-600">
        Track your daily calorie intake and stay on top of your health goals.
      </p>
    </section>
  );
}
