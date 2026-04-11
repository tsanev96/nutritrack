import { act, renderHook } from "@testing-library/react";
import { useStore } from "@/stores/useStore";
import { getTodayDate } from "@/utils/dates";

jest.mock("@/features/food/services/api", () => ({
  insertFoodLog: jest.fn(),
  deleteFoodLog: jest.fn(),
  insertExerciseLog: jest.fn(),
  deleteExerciseLog: jest.fn(),
  upsertWaterIntake: jest.fn(),
  upsertRecentFood: jest.fn(),
}));

jest.mock("@/features/checkIn/services/api", () => ({
  upsertCheckIn: jest.fn(),
}));

jest.mock("@/features/goals/services/api", () => ({
  upsertMacroGoals: jest.fn(),
  upsertMicroGoals: jest.fn(),
  upsertFitnessGoals: jest.fn(),
  upsertWaterGoal: jest.fn(),
}));

beforeEach(() => {
  useStore.setState({
    userId: null,
    foodLogs: {},
    exerciseLogs: {},
    waterLogs: {},
    waterGoal: 2000,
    checkIns: [],
    recentFoods: [],
  });
});

const todaysDate = getTodayDate();

describe("addEntry", () => {
  it("adds a food entry to the correct meal and date", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        entry: { id: "1", name: "oats", calories: 300 },
        meal: "breakfast",
      });
    });
    expect(result.current.foodLogs[todaysDate].breakfast).toHaveLength(1);
    expect(result.current.foodLogs[todaysDate].breakfast[0].name).toBe("oats");
  });

  it("appends to existing entries", () => {
    const { result } = renderHook(() => useStore());
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
    const breakfast = result.current.foodLogs[todaysDate].breakfast;
    expect(breakfast).toHaveLength(2);
    expect(breakfast[0].name).toBe("Oats");
    expect(breakfast[1].name).toBe("Banana");
  });

  it("does not affect other meals", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        meal: "breakfast",
        entry: { id: "1", name: "Oats", calories: 300 },
      });
    });
    expect(result.current.foodLogs[todaysDate].lunch).toHaveLength(0);
  });
});

describe("removeEntry", () => {
  it("removes the entry with the matching id", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addEntry({
        date: todaysDate,
        meal: "lunch",
        entry: { id: "1", name: "Salad", calories: 200 },
      });
    });
    expect(result.current.foodLogs[todaysDate].lunch).toHaveLength(1);
    act(() => {
      result.current.removeEntry({ date: todaysDate, meal: "lunch", id: "1" });
    });
    expect(result.current.foodLogs[todaysDate].lunch).toHaveLength(0);
  });

  it("does nothing when date has no log", () => {
    const { result } = renderHook(() => useStore());
    expect(() => {
      act(() => {
        result.current.removeEntry({ date: "2099-01-01", meal: "lunch", id: "x" });
      });
    }).not.toThrow();
  });
});

describe("addWaterIntake", () => {
  it("adds water to the day log", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addWaterIntake({ date: todaysDate, amount: 500 });
    });
    expect(result.current.waterLogs[todaysDate]).toBe(500);
  });

  it("accumulates water across multiple calls", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addWaterIntake({ date: todaysDate, amount: 300 });
      result.current.addWaterIntake({ date: todaysDate, amount: 200 });
    });
    expect(result.current.waterLogs[todaysDate]).toBe(500);
  });
});

describe("addCheckIn", () => {
  it("adds a new check-in", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addCheckIn({ date: todaysDate, weight: 80, measurements: {} });
    });
    expect(result.current.checkIns).toHaveLength(1);
    expect(result.current.checkIns[0].weight).toBe(80);
  });

  it("replaces an existing check-in for the same date", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addCheckIn({ date: todaysDate, weight: 80, measurements: {} });
      result.current.addCheckIn({ date: todaysDate, weight: 79, measurements: {} });
    });
    expect(result.current.checkIns).toHaveLength(1);
    expect(result.current.checkIns[0].weight).toBe(79);
  });
});

describe("setMacroGoals", () => {
  it("updates macro goals in the store", () => {
    const { result } = renderHook(() => useStore());
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
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addExercise({
        date: todaysDate,
        exercise: { id: "1", name: "squat", caloriesBurned: 500, durationMinutes: 45 },
      });
    });
    const exercises = result.current.exerciseLogs[todaysDate];
    expect(exercises).toHaveLength(1);
    expect(exercises[0].name).toBe("squat");
    expect(exercises[0].caloriesBurned).toBe(500);
    expect(exercises[0].durationMinutes).toBe(45);
  });

  it("appends to existing exercises", () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addExercise({
        date: todaysDate,
        exercise: { id: "1", name: "squat", caloriesBurned: 500, durationMinutes: 45 },
      });
      result.current.addExercise({
        date: todaysDate,
        exercise: { id: "2", name: "running", caloriesBurned: 150, durationMinutes: 20 },
      });
    });
    const exercises = result.current.exerciseLogs[todaysDate];
    expect(exercises).toHaveLength(2);
    expect(exercises[0].name).toBe("squat");
    expect(exercises[1].name).toBe("running");
  });
});
