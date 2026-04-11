import Headline from "@/components/ui/Headline";
import PageWrapper from "@/components/common/PageWrapper";
import Paragraph from "@/components/ui/Paragraph";
import Image from "next/image";

export default function Home() {
  return (
    <PageWrapper>
      <Headline title="Welcome to the Calorie Tracker App!" />
      <Paragraph className="mb-6">
        Track your daily calorie intake and stay on top of your health goals.
      </Paragraph>
      <Image
        src="/assets/random_meal.png"
        alt="Random meal"
        width={600}
        height={400}
      />
    </PageWrapper>
  );
}
