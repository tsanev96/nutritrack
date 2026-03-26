import WaterGoalSection from "@/features/goals/components/WaterGoalSection";
import { useTrackerStore } from "@/stores/useTrackerStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/stores/useTrackerStore");
jest.mock("@/lib/supabase");

const mockSetWaterGoal = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useTrackerStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      setWaterGoals: mockSetWaterGoal,
    }),
  );
});

describe("Water Goal Section", () => {
  it("renders the section heading", () => {
    render(<WaterGoalSection />);
    expect(screen.getByText("Micronutrients")).toBeInTheDocument();
  });

  it("renders group labels", () => {
    render(<WaterGoalSection />);
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("daily goal")).toBeInTheDocument();
  });

  it("shows the Edit button in view mode", () => {
    render(<WaterGoalSection />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("shows Save and Cancel buttons after clicking Edit", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows inputs in edit mode", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("calls setWaterGoals when save is clicked", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockSetWaterGoal).toHaveBeenCalledTimes(1);
  });

  it("returns to view mode after Cancel without calling setGoals", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockSetWaterGoal).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
