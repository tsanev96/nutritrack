import Headline from "@/components/ui/Headline";
import PageWrapper from "@/components/common/PageWrapper";
import Paragraph from "@/components/ui/Paragraph";

export default function Home() {
  return (
    <PageWrapper>
      <Headline title="Welcome to the Calorie Tracker App!" />
      <Paragraph>
        Track your daily calorie intake and stay on top of your health goals.
      </Paragraph>
    </PageWrapper>
  );
}
