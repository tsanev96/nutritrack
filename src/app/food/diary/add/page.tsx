"use client";

// u can wrap in <Suspense> if u want to show a loading state while the component is being loaded

export const dynamic = "force-dynamic";

import AddEntry from "@/features/food/components/AddEntry";
import PageWrapper from "@/components/common/PageWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import type { Meal } from "@/types";

export default function AddEntryPage() {
  const router = useRouter();
  const params = useSearchParams();

  const meal = params.get("meal") as Meal;
  const date = params.get("date") ?? "";

  return (
    <PageWrapper>
      <AddEntry meal={meal} date={date} onClose={() => router.back()} />
    </PageWrapper>
  );
}
