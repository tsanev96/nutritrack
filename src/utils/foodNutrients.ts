import type { FoodSuggestion } from "@/lib/foodApi";

export function getNutrientSections(food: FoodSuggestion) {
  return [
    {
      title: "Macros",
      rows: [
        { label: "Protein", value: food.protein, unit: "g" },
        { label: "Carbs", value: food.carbs, unit: "g" },
        { label: "Fat", value: food.fats, unit: "g" },
        { label: "Fiber", value: food.fiber, unit: "g" },
        { label: "Sugar", value: food.sugar, unit: "g" },
        { label: "Cholesterol", value: food.cholesterol, unit: "mg" },
      ],
    },
    {
      title: "Fat breakdown",
      rows: [
        { label: "Saturated", value: food.saturatedFat, unit: "g" },
        { label: "Trans", value: food.transFat, unit: "g" },
        { label: "Mono fat", value: food.monounsaturatedFat, unit: "g" },
        { label: "Poly fat", value: food.polyunsaturatedFat, unit: "g" },
      ],
    },
    {
      title: "Minerals & Vitamins",
      rows: [
        { label: "Sodium", value: food.sodium, unit: "mg" },
        { label: "Calcium", value: food.calcium, unit: "mg" },
        { label: "Iron", value: food.iron, unit: "mg" },
        { label: "Vitamin A", value: food.vitaminA, unit: "IU" },
        { label: "Vitamin C", value: food.vitaminC, unit: "mg" },
      ],
    },
  ];
}
