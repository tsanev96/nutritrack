import { mockSupabaseClient } from "@/__tests__/db";
import { upsertMicroGoals, fetchMicroGoals } from "@/features/goals/services/api";
import { DEFAULT_MICRO_GOALS } from "@/config/constants";

jest.mock("@/lib/supabase");

const { eq, from, select, single, upsert } = mockSupabaseClient;

beforeEach(() => {
  jest.clearAllMocks();
  upsert.mockResolvedValue({ error: null });
  eq.mockReturnValue({ single });
  select.mockReturnValue({ eq });
  from.mockReturnValue({ upsert, select });
});

describe("upsertMicroGoals", () => {
  it("calls supabase with the correct table and mapped fields", async () => {
    await upsertMicroGoals("user-1", DEFAULT_MICRO_GOALS);
    expect(from).toHaveBeenCalledWith("micro_nutrient_goals");
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1" }),
      { onConflict: "user_id" },
    );
  });

  it("maps camelCase goals to snake_case DB columns", async () => {
    await upsertMicroGoals("user-1", DEFAULT_MICRO_GOALS);
    const payload = upsert.mock.calls[0][0]; // Get the first argument of the first call to upsert
    expect(payload).toHaveProperty("saturated_fat");
    expect(payload).toHaveProperty("sugar");
    expect(payload).toHaveProperty("fiber");
  });
});

describe("fetchMicroGoals", () => {
  it("returns default goals when no data exists", async () => {
    single.mockResolvedValue({ data: null, error: null });
    const result = await fetchMicroGoals("user-1");
    expect(result).toEqual(DEFAULT_MICRO_GOALS);
  });

  it("maps DB snake_case columns back to camelCase", async () => {
    single.mockResolvedValue({
      data: {
        saturated_fat: 10,
        polyunsaturated_fat: 5,
        monounsaturated_fat: 8,
        trans_fat: 0,
        fiber: 25,
        sugar: 30,
        cholesterol: 200,
        sodium: 2000,
        potassium: 3500,
        calcium: 1000,
        iron: 18,
        vitamin_a: 900,
        vitamin_c: 90,
        vitamin_d: 15,
        vitamin_e: 15,
        vitamin_k: 120,
      },
      error: null,
    });
    const result = await fetchMicroGoals("user-1");
    expect(result.saturatedFat.value).toBe(10);
    expect(result.vitaminA.value).toBe(900);
    expect(result.sodium.unit).toBe("mg");
  });
});
