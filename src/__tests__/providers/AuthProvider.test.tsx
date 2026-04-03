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

function makeSession(user = makeUser()) {
  return { data: { session: { user } } };
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
    // getSession never resolves → stays in loading state
    mockSupabaseClient.auth.getSession.mockReturnValue(new Promise(() => {}));

    renderAuthProvider();

    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    // spinner is a div with animate-spin class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});

describe("AuthProvider — authenticated user", () => {
  beforeEach(() => {
    mockSupabaseClient.auth.getSession.mockResolvedValue(makeSession());
  });

  it("renders children on a protected path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    renderAuthProvider();

    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );
  });

  it("does not redirect an authenticated user away from a protected path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    renderAuthProvider();

    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalledWith("/auth/login");
  });

  it("redirects an authenticated user away from /auth/login", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");

    renderAuthProvider();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });

  it("redirects an authenticated user away from /auth/signup", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/signup");

    renderAuthProvider();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });
});

describe("AuthProvider — unauthenticated user", () => {
  beforeEach(() => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
    });
  });

  it("redirects to /auth/login when visiting a protected path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    renderAuthProvider();

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/auth/login"),
    );
  });

  it("renders children on /auth/login without redirecting", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");

    renderAuthProvider(<div>login form</div>);

    await waitFor(() =>
      expect(screen.getByText("login form")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("renders children on /auth/signup without redirecting", async () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/signup");

    renderAuthProvider(<div>signup form</div>);

    await waitFor(() =>
      expect(screen.getByText("signup form")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe("AuthProvider — real-time auth state changes", () => {
  it("redirects to /auth/login when the user logs out", async () => {
    // Start authenticated
    mockSupabaseClient.auth.getSession.mockResolvedValue(makeSession());
    (usePathname as jest.Mock).mockReturnValue("/");

    renderAuthProvider();

    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );

    // Simulate logout event from Supabase
    act(() => {
      authStateCallback("SIGNED_OUT", null);
    });

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/auth/login"),
    );
  });

  it("stops redirecting after the user signs in via auth state change", async () => {
    // Start unauthenticated on the login page
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
    });
    (usePathname as jest.Mock).mockReturnValue("/auth/login");

    renderAuthProvider(<div>login form</div>);

    await waitFor(() =>
      expect(screen.getByText("login form")).toBeInTheDocument(),
    );

    // Simulate sign-in event — now on /auth/login should redirect to /
    act(() => {
      authStateCallback("SIGNED_IN", { user: makeUser() });
    });

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
  });
});

describe("AuthProvider — cleanup", () => {
  it("unsubscribes from auth state changes when unmounted", async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue(makeSession());

    const { unmount } = renderAuthProvider();

    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
