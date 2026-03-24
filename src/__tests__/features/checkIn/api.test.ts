import { mockSupabaseClient } from "@/__tests__/db";
import { fetchCheckIns, upsertCheckIn } from "@/features/checkIn/api";
import { getTodayDate } from "@/utils/dates";

const { eq, from, select, single, upsert } = mockSupabaseClient;

jest.mock("@/lib/supabase");

beforeEach(() => {
  jest.clearAllMocks();
  mockSupabaseClient.select.mockReturnValue({ eq: mockSupabaseClient.eq });
  mockSupabaseClient.from.mockReturnValue({
    upsert: mockSupabaseClient.upsert,
    select: mockSupabaseClient.select,
  });
});

const measurements = { neck: 30, waist: 50, hips: 80 };
describe("upsertCheckIn", () => {
  it("calls supabase with the correct table", async () => {
    mockSupabaseClient.upsert.mockResolvedValue({ error: null });
    await upsertCheckIn("user-1", {
      date: getTodayDate(),
      weight: 90,
      measurements,
    });
    expect(from).toHaveBeenCalledWith("check_ins");
  });

  it("passes user_id, date, weight and measurement fields", async () => {
    mockSupabaseClient.upsert.mockResolvedValue({ error: null });
    await upsertCheckIn("user-1", {
      date: "2026-03-24",
      weight: 90,
      measurements,
    });
    const payload = upsert.mock.calls[0][0];
    expect(payload).toMatchObject({
      user_id: "user-1",
      neck: 30,
      waist: 50,
      hips: 80,
      date: "2026-03-24",
    });
  });

  it("sets missing measurements to null", async () => {
    mockSupabaseClient.upsert.mockResolvedValue({ error: null });
    await upsertCheckIn("user-1", {
      date: getTodayDate(),
      weight: 90,
      measurements: {},
    });
    const payload = upsert.mock.calls[0][0];
    expect(payload.neck).toBeNull();
    expect(payload.hips).toBeNull();
    expect(payload.waist).toBeNull();
  });
});

describe("fetchCheckIns", () => {
  it("returns an empty array when there is no data", async () => {
    eq.mockResolvedValue({ data: null, error: null });
    const result = await fetchCheckIns("user_1");
    expect(result).toEqual([]);
  });

  it("maps DB rows to CheckIn shape", async () => {
    eq.mockResolvedValue({
      data: [{ date: "2026-03-24", weight: 90, ...measurements }],
      error: null,
    });
    const result = await fetchCheckIns("user_1");
    expect(result).toEqual([
      {
        date: "2026-03-24",
        weight: 90,
        measurements,
      },
    ]);
  });
});
