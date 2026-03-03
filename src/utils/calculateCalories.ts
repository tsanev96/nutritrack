interface CalcCaloriesInput {
  fats: number;
  protein: number;
  carbs: number;
}

export function calcCalories({ carbs, fats, protein }: CalcCaloriesInput) {
  return fats * 9 + protein * 4 + carbs * 4;
}
