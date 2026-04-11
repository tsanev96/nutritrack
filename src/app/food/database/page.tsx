"use client";

import { useStore } from "@/stores/useStore";
import PageWrapper from "@/components/common/PageWrapper";
import Headline from "@/components/ui/Headline";
import CardSection from "@/components/common/CardSection";
import Paragraph from "@/components/ui/Paragraph";
import Span from "@/components/ui/Span";
import type { Entry } from "@/types";

function FoodCard({ food }: Readonly<{ food: Entry }>) {
  return (
    <CardSection>
      <div className="flex items-start justify-between">
        <Paragraph
          variant="sm"
          className="font-medium text-gray-800 line-clamp-1"
        >
          {food.name}
        </Paragraph>
        <Span>{food.calories} kcal</Span>
      </div>
      <div className="flex gap-4 text-xs text-gray-400">
        <Span>{food.protein && `P ${food.protein}g`}</Span>
        <Span>{food.carbs && `C ${food.carbs}g`}</Span>
        <Span>{food.fats && `F ${food.fats}g`}</Span>
        <Span>{food.sodium && `Na ${food.sodium}mg`}</Span>
        <Span>{food.sugar && `Sugar ${food.sugar}g`}</Span>
      </div>
    </CardSection>
  );
}

export default function FoodDatabasePage() {
  const recentFoods = useStore((s) => s.recentFoods);

  if (recentFoods.length === 0)
    return (
      <Paragraph variant="sm" className="text-gray-500">
        No recent foods. Start tracking to see them here!
      </Paragraph>
    );

  return (
    <PageWrapper>
      <Headline title="Recent Foods" variant="h1" />
      {recentFoods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </PageWrapper>
  );
}
