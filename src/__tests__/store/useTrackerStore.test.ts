import { act, renderHook } from "@testing-library/react";
import { useTrackerStore } from "@/stores/useTrackerStore";
import { getTodayDate } from "@/utils/dates";

// Mock all DB/API calls so tests don't hit Supabase
jest.mock("@/lib/db", () => ({
  insertFoodLog: jest.fn(),
  deleteFoodLog: jest.fn(),
  insertExerciseLog: jest.fn(),
  deleteExerciseLog: jest.fn(),
  upsertWaterIntake: jest.fn(),
}));

jest.mock("@/features/checkIn/services/api", () => ({
  upsertCheckIn: jest.fn(),
}));

jest.mock("@/features/goals/services/api", () => ({
  upsertMacroGoals: jest.fn(),
  upsertMicroGoals: jest.fn(),
  upsertFitnessGoals: jest.fn(),
}));

beforeEach(() => {
  useTrackerStore.setState({
    userId: null,
    logs: {},
    checkIns: [],
    waterGoals: 2000,
  });
});

const todaysDate = getTodayDate();

describe("addEntry", () => {
  it("adds a food entry to the correct meal and date", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        entry: { id: "1", name: "oats", calories: 300 },
        meal: "breakfast",
      });
    });
    const log = result.current.logs[todaysDate];
    expect(log.breakfast).toHaveLength(1);
    expect(log.breakfast[0].name).toBe("oats");
  });

  it("appends to existing entries - adding additional food", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        meal: "breakfast",
        entry: { id: "1", name: "Oats", calories: 300 },
      });
      result.current.addEntry({
        date: todaysDate,
        meal: "breakfast",
        entry: { id: "2", name: "Banana", calories: 90 },
      });
    });

    const log = result.current.logs[todaysDate];
    expect(log.breakfast).toHaveLength(2);
    expect(log.breakfast[0].name).toBe("Oats");
    expect(log.breakfast[1].name).toBe("Banana");
  });

  it("does not affect other meals", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        meal: "breakfast",
        entry: { id: "1", name: "Oats", calories: 300 },
      });
    });
    expect(result.current.logs[todaysDate].lunch).toHaveLength(0);
  });
});

describe("removeEntry", () => {
  it("removes the entry with the matching id", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        meal: "lunch",
        entry: { id: "1", name: "Salad", calories: 200 },
      });
    });
    const log = result.current.logs[todaysDate];
    expect(log.lunch).toHaveLength(1);
    act(() => {
      result.current.removeEntry({
        date: todaysDate,
        meal: "lunch",
        id: "1",
      });
    });
    expect(log.lunch).toHaveLength(0);
  });

  it("does nothing when date has no log", () => {
    const { result } = renderHook(() => useTrackerStore());
    expect(() => {
      act(() => {
        result.current.removeEntry({
          date: "2099-01-01",
          meal: "lunch",
          id: "x",
        });
      });
    }).not.toThrow();
  });
});

describe("addWaterIntake", () => {
  it("adds water to the day log", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addWaterIntake({ date: todaysDate, amount: 500 });
    });
    expect(result.current.logs[todaysDate].water).toBe(500);
  });

  it("accumulates water across multiple calls", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addWaterIntake({ date: todaysDate, amount: 300 });
      result.current.addWaterIntake({ date: todaysDate, amount: 200 });
    });
    expect(result.current.logs[todaysDate].water).toBe(500);
  });
});

describe("addCheckIn", () => {
  it("adds a new check-in", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addCheckIn({
        date: todaysDate,
        weight: 80,
        measurements: {},
      });
    });
    expect(result.current.checkIns).toHaveLength(1);
    expect(result.current.checkIns[0].weight).toBe(80);
  });

  it("replaces an existing check-in for the same date", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addCheckIn({
        date: todaysDate,
        weight: 80,
        measurements: {},
      });
      result.current.addCheckIn({
        date: todaysDate,
        weight: 79,
        measurements: {},
      });
    });
    expect(result.current.checkIns).toHaveLength(1);
    expect(result.current.checkIns[0].weight).toBe(79);
  });
});

describe("setMacroGoals", () => {
  it("updates macro goals in the store", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.setMacroGoals({ protein: 180, carbs: 220, fats: 70 });
    });
    expect(result.current.macroGoals.protein).toBe(180);
    expect(result.current.macroGoals.carbs).toBe(220);
    expect(result.current.macroGoals.fats).toBe(70);
  });
});

describe("addExercise", () => {
  it("adds a new exercise to the correct date", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addExercise({
        date: todaysDate,
        exercise: {
          id: "1",
          name: "squat",
          caloriesBurned: 500,
          durationMinutes: 45,
        },
      });
    });

    const exercises = result.current.logs[todaysDate].exercises;
    expect(exercises).toHaveLength(1);
    expect(exercises[0].name).toBe("squat");
    expect(exercises[0].caloriesBurned).toBe(500);
    expect(exercises[0].durationMinutes).toBe(45);
  });

  it("appends to existing exercise", () => {
    const { result } = renderHook(() => useTrackerStore());
    act(() => {
      result.current.addExercise({
        date: todaysDate,
        exercise: {
          id: "1",
          name: "squat",
          caloriesBurned: 500,
          durationMinutes: 45,
        },
      });
    });

    act(() => {
      result.current.addExercise({
        date: todaysDate,
        exercise: {
          id: "2",
          name: "running",
          caloriesBurned: 150,
          durationMinutes: 20,
        },
      });
    });

    const exercises = result.current.logs[todaysDate].exercises;
    expect(exercises).toHaveLength(2);
    expect(exercises[0].name).toBe("squat");
    expect(exercises[0].caloriesBurned).toBe(500);
    expect(exercises[0].durationMinutes).toBe(45);
    expect(exercises[1].name).toBe("running");
    expect(exercises[1].caloriesBurned).toBe(150);
    expect(exercises[1].durationMinutes).toBe(20);
  });
});
