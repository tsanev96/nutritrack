import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckInPage from "@/features/checkIn/components/CheckInPage";
import { useStore } from "@/stores/useStore";

jest.mock("@/stores/useStore");
jest.mock("@/lib/supabase");
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockAddCheckIn = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      checkIns: [],
      addCheckIn: mockAddCheckIn,
      fitnessGoals: { weightUnit: "kg" },
    }),
  );
});

describe("CheckInPage", () => {
  it("renders the page heading", () => {
    render(<CheckInPage />);
    expect(screen.getByText("Check-in")).toBeInTheDocument();
  });

  it("renders the weight input", () => {
    render(<CheckInPage />);
    expect(screen.getByText("Today's Weight")).toBeInTheDocument();
  });

  it("renders the measurements table with neck, waist, hips rows", () => {
    render(<CheckInPage />);
    expect(screen.getByText("Neck")).toBeInTheDocument();
    expect(screen.getByText("Waist")).toBeInTheDocument();
    expect(screen.getByText("Hips")).toBeInTheDocument();
  });

  it("renders the Save button", () => {
    render(<CheckInPage />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("calls addCheckIn when Save is clicked", async () => {
    const user = userEvent.setup();
    render(<CheckInPage />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockAddCheckIn).toHaveBeenCalledTimes(1);
  });

  it("shows confirmation message after saving", async () => {
    const user = userEvent.setup();
    render(<CheckInPage />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText("Check-in saved!")).toBeInTheDocument();
  });

  it("renders the Edit history link", () => {
    render(<CheckInPage />);
    expect(
      screen.getByRole("link", { name: /edit history/i }),
    ).toHaveAttribute("href", "/measurements/edit");
  });
});
