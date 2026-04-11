import { render, screen, waitFor, act } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import AuthProvider from "@/providers/AuthProvider";
import { mockSupabaseClient } from "@/__tests__/db";

jest.mock("@/lib/supabase");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockReplace = jest.fn();
const mockUnsubscribe = jest.fn();

// Captures the onAuthStateChange callback so tests can fire auth events manually
let authStateCallback: (event: string, session: unknown) => void;

function makeUser(overrides = {}) {
  return { id: "user-1", email: "test@example.com", ...overrides };
}

beforeEach(() => {
  jest.clearAllMocks();

  (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  (usePathname as jest.Mock).mockReturnValue("/");

  mockSupabaseClient.auth.onAuthStateChange.mockImplementation(
    (cb: (event: string, session: unknown) => void) => {
      authStateCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    },
  );
});

function renderAuthProvider(children = <div>protected content</div>) {
  return render(<AuthProvider>{children}</AuthProvider>);
}

describe("AuthProvider — loading state", () => {
  it("shows a loading spinner while the session check is in progress", () => {
    // onAuthStateChange callback never fired → stays loading
    renderAuthProvider();
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});

describe("AuthProvider — authenticated user", () => {
  it("renders children on a protected path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", { user: makeUser() }); });

    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );
  });

  it("does not redirect an authenticated user away from a protected path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", { user: makeUser() }); });

    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalledWith("/auth/login");
  });

  it("redirects an authenticated user away from /auth/login", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");
    renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", { user: makeUser() }); });

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });

  it("redirects an authenticated user away from /auth/signup", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/signup");
    renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", { user: makeUser() }); });

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });
});

describe("AuthProvider — unauthenticated user", () => {
  it("redirects to /auth/login when visiting a protected path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", null); });

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/auth/login"),
    );
  });

  it("renders children on /auth/login without redirecting", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");
    renderAuthProvider(<div>login form</div>);

    act(() => { authStateCallback("INITIAL_SESSION", null); });

    await waitFor(() =>
      expect(screen.getByText("login form")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("renders children on /auth/signup without redirecting", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/signup");
    renderAuthProvider(<div>signup form</div>);

    act(() => { authStateCallback("INITIAL_SESSION", null); });

    await waitFor(() =>
      expect(screen.getByText("signup form")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe("AuthProvider — real-time auth state changes", () => {
  it("redirects to /auth/login when the user logs out", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", { user: makeUser() }); });
    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );

    act(() => { authStateCallback("SIGNED_OUT", null); });

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/auth/login"),
    );
  });

  it("stops redirecting after the user signs in via auth state change", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");
    renderAuthProvider(<div>login form</div>);

    act(() => { authStateCallback("INITIAL_SESSION", null); });
    await waitFor(() =>
      expect(screen.getByText("login form")).toBeInTheDocument(),
    );

    act(() => { authStateCallback("SIGNED_IN", { user: makeUser() }); });

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });
});

describe("AuthProvider — cleanup", () => {
  it("unsubscribes from auth state changes when unmounted", async () => {
    const { unmount } = renderAuthProvider();

    act(() => { authStateCallback("INITIAL_SESSION", { user: makeUser() }); });
    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
