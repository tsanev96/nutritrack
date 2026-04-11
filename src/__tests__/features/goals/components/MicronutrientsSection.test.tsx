import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_MICRO_GOALS } from "@/config/constants";
import MicronutrientsSection from "@/features/goals/components/MicronutrientsSection";
import { useStore } from "@/stores/useStore";

jest.mock("@/stores/useStore");
jest.mock("@/lib/supabase");

const mockSetGoals = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      microNutrientGoals: DEFAULT_MICRO_GOALS,
      setMicroNutrientGoals: mockSetGoals,
    }),
  );
});

describe("MicronutrientsSection", () => {
  it("renders the section heading", () => {
    render(<MicronutrientsSection />);
    expect(screen.getByText("Micronutrients")).toBeInTheDocument();
  });

  it("renders group labels", () => {
    render(<MicronutrientsSection />);
    expect(screen.getByText("Fats")).toBeInTheDocument();
    expect(screen.getByText("Carbohydrates")).toBeInTheDocument();
    expect(screen.getByText("Minerals")).toBeInTheDocument();
    expect(screen.getByText("Vitamins")).toBeInTheDocument();
  });

  it("shows the Edit button in view mode", () => {
    render(<MicronutrientsSection />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("shows Save and Cancel buttons after clicking Edit", async () => {
    const user = userEvent.setup();
    render(<MicronutrientsSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows inputs in edit mode", async () => {
    const user = userEvent.setup();
    render(<MicronutrientsSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("calls setMicroNutrientGoals when Save is clicked", async () => {
    const user = userEvent.setup();
    render(<MicronutrientsSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockSetGoals).toHaveBeenCalledTimes(1);
  });

  it("returns to view mode after Cancel without calling setGoals", async () => {
    const user = userEvent.setup();
    render(<MicronutrientsSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockSetGoals).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
