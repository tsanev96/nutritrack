import WaterGoalSection from "@/features/goals/components/WaterGoalSection";
import { useStore } from "@/stores/useStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/stores/useStore");
jest.mock("@/lib/supabase");

const mockSetWaterGoal = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      waterGoal: 2000,
      setWaterGoal: mockSetWaterGoal,
    }),
  );
});

describe("Water Goal Section", () => {
  it("renders the section heading", () => {
    render(<WaterGoalSection />);
    expect(screen.getByText("Water")).toBeInTheDocument();
  });

  it("renders the daily goal in view mode", () => {
    render(<WaterGoalSection />);
    expect(screen.getByText("Daily goal")).toBeInTheDocument();
    expect(screen.getByText("2000 ml")).toBeInTheDocument();
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

  it("shows input in edit mode", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("calls setWaterGoal when Save is clicked", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockSetWaterGoal).toHaveBeenCalledTimes(1);
  });

  it("returns to view mode after Cancel without calling setWaterGoal", async () => {
    const user = userEvent.setup();
    render(<WaterGoalSection />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockSetWaterGoal).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
