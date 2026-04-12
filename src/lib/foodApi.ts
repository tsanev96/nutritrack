const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";

// https://fdc.nal.usda.gov/GBFPD_Documentation
/** USDA nutrient IDs */
const NUTRIENT = {
  protein: 1003,
  fat: 1004,
  carbs: 1005,
  calories: 1008,
  sugar: 2000,
  fiber: 1079,
  calcium: 1087,
  iron: 1089,
  sodium: 1093,
  vitaminA: 1104,
  vitaminC: 1162,
  cholesterol: 1253,
  transFat: 1257,
  saturatedFat: 1258,
  monounsaturatedFat: 1292,
  polyunsaturatedFat: 1293,
} as const;

export type FoodSuggestion = {
  fdcId: number;
  description: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServing?: string;
  // macros (per serving)
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  // fat breakdown
  saturatedFat?: number;
  transFat?: number;
  monounsaturatedFat?: number;
  polyunsaturatedFat?: number;
  // other
  fiber?: number;
  sugar?: number;
  cholesterol?: number;
  sodium?: number;
  // minerals
  calcium?: number;
  iron?: number;
  // vitamins
  vitaminA?: number;
  vitaminC?: number;
};

type RawNutrient = {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
};

type RawFood = {
  fdcId: number;
  description: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: RawNutrient[];
};

type SearchResponse = { foods: RawFood[] };

function getNutrientValue(
  nutrients: RawNutrient[],
  id: number,
): number | undefined {
  return nutrients.find((n) => n.nutrientId === id)?.value;
}

function mapFoods(foods: RawFood[]): FoodSuggestion[] {
  return foods.map(
    ({
      fdcId,
      description,
      brandName,
      servingSize,
      servingSizeUnit,
      householdServingFullText,
      foodNutrients,
    }) => {
      const get = (id: number) => getNutrientValue(foodNutrients, id);

      return {
        fdcId,
        description,
        brandName: brandName ?? undefined,
        servingSize: servingSize ?? undefined,
        servingSizeUnit: servingSizeUnit ?? undefined,
        householdServing: householdServingFullText ?? undefined,
        calories: get(NUTRIENT.calories) ?? 0,
        protein: get(NUTRIENT.protein) ?? 0,
        carbs: get(NUTRIENT.carbs) ?? 0,
        fats: get(NUTRIENT.fat) ?? 0,
        saturatedFat: get(NUTRIENT.saturatedFat),
        transFat: get(NUTRIENT.transFat),
        monounsaturatedFat: get(NUTRIENT.monounsaturatedFat),
        polyunsaturatedFat: get(NUTRIENT.polyunsaturatedFat),
        fiber: get(NUTRIENT.fiber),
        sugar: get(NUTRIENT.sugar),
        cholesterol: get(NUTRIENT.cholesterol),
        sodium: get(NUTRIENT.sodium),
        calcium: get(NUTRIENT.calcium),
        iron: get(NUTRIENT.iron),
        vitaminA: get(NUTRIENT.vitaminA),
        vitaminC: get(NUTRIENT.vitaminC),
      };
    },
  );
}

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_USDA_API_KEY;
  if (key == null)
    throw new Error("NEXT_PUBLIC_USDA_API_KEY is not set in .env.local");
  return key;
}

export async function searchFood(query: string): Promise<FoodSuggestion[]> {
  const key = getApiKey();
  const url = `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=6&api_key=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`USDA API error: ${res.status}`);
  const data: SearchResponse = await res.json();
  return mapFoods(data.foods);
}

// ─── Open Food Facts (barcode lookup) ────────────────────────────────────────

const OFF_BASE = "https://world.openfoodfacts.org/api/v2";

type OFFProduct = {
  product_name?: string;
  brands?: string;
  serving_size?: string;
  nutriments?: Record<string, number>;
};

type OFFResponse = {
  status: number; // 1 = found, 0 = not found
  product?: OFFProduct;
};

export async function searchFoodByBarcode(
  barcode: string,
): Promise<FoodSuggestion[]> {
  const res = await fetch(`${OFF_BASE}/product/${encodeURIComponent(barcode)}`);
  if (!res.ok) throw new Error(`Open Food Facts API error: ${res.status}`);

  const data: OFFResponse = await res.json();
  if (data.status === 0 || !data.product) return [];

  const {
    product_name,
    brands,
    serving_size,
    nutriments: n = {},
  } = data.product;

  return [
    {
      fdcId: Number(barcode), // used as a unique key in the UI
      description: product_name ?? barcode,
      brandName: brands ?? undefined,
      householdServing: serving_size ?? undefined,
      calories: n["energy-kcal_serving"] ?? n["energy-kcal_100g"] ?? 0,
      protein: n["proteins_serving"] ?? n["proteins_100g"] ?? 0,
      carbs: n["carbohydrates_serving"] ?? n["carbohydrates_100g"] ?? 0,
      fats: n["fat_serving"] ?? n["fat_100g"] ?? 0,
      saturatedFat: n["saturated-fat_serving"] ?? n["saturated-fat_100g"],
      sugar: n["sugars_serving"] ?? n["sugars_100g"],
      fiber: n["fiber_serving"] ?? n["fiber_100g"],
      sodium: n["sodium_serving"] ?? n["sodium_100g"],
    },
  ];
}
