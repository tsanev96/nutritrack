export type FoodUnit =
  | "g"
  | "oz"
  | "l"
  | "lb"
  | "kg"
  | "ml"
  | "cup"
  | "tbsp"
  | "tsp";

/** How many grams (or ml) is one unit */
const TO_BASE: Record<FoodUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.6,
  ml: 1,
  l: 1000,
  cup: 236.6,
  tbsp: 15,
  tsp: 5,
};

export const SOLID_UNITS: FoodUnit[] = ["g", "oz", "lb", "tbsp", "tsp", "kg"];
export const LIQUID_UNITS: FoodUnit[] = ["ml", "l", "cup", "tbsp", "tsp"];

export function isLiquid(servingSizeUnit?: string): boolean {
  if (servingSizeUnit == null) return false;
  return LIQUID_UNITS.includes(servingSizeUnit.toLowerCase() as FoodUnit);
}

/** Convert quantity in given unit to grams/ml (what the API values are based on per 100) */
export function toBaseAmount(quantity: number, unit: FoodUnit): number {
  return quantity * TO_BASE[unit];
}
