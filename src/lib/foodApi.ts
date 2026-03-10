const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";

// https://fdc.nal.usda.gov/GBFPD_Documentation
/** USDA nutrient IDs for the macros we care about */
const NUTRIENT = {
  protein: 1003,
  fat: 1004,
  carbs: 1005,
} as const;

export type FoodSuggestion = {
  fdcId: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
};

type RawNutrient = { nutrientId: number; value: number };
type RawFood = {
  fdcId: number;
  description: string;
  foodNutrients: RawNutrient[];
};
type SearchResponse = { foods: RawFood[] };

function getVal(nutrients: RawNutrient[], id: number) {
  return Math.round(nutrients.find((n) => n.nutrientId === id)?.value ?? 0);
}

export async function searchFood(query: string): Promise<FoodSuggestion[]> {
  const key = process.env.NEXT_PUBLIC_USDA_API_KEY;
  if (!key)
    throw new Error("NEXT_PUBLIC_USDA_API_KEY is not set in .env.local");

  const url = `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=6&api_key=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`USDA API error: ${res.status}`);

  const data: SearchResponse = await res.json();

  return data.foods.map(({ description, fdcId, foodNutrients }) => ({
    fdcId: fdcId,
    description: description,
    protein: getVal(foodNutrients, NUTRIENT.protein),
    carbs: getVal(foodNutrients, NUTRIENT.carbs),
    fats: getVal(foodNutrients, NUTRIENT.fat),
  }));
}
