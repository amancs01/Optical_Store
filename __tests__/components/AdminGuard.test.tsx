import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminGuard } from "@/components/admin/AdminGuard";

const mockReplace = vi.fn();
let mockUser: any = null;
let mockIsAdmin = false;
let mockLoading = true;
let mockSupabaseConfigured = true;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("@/lib/auth/admin", () => ({
  useCurrentUser: () => ({ user: mockUser, isAdmin: mockIsAdmin, loading: mockLoading }),
}));

vi.mock("@/lib/supabase/client", () => ({
  isSupabaseConfigured: () => mockSupabaseConfigured,
}));

vi.mock("@/components/ui/StateMessage", () => ({
  StateMessage: ({ title, message }: any) => <div data-testid="state-message"><h1>{title}</h1><p>{message}</p></div>,
}));

describe("AdminGuard", () => {
  it("shows loading state", () => {
    render(<AdminGuard><p>Content</p></AdminGuard>);
    expect(screen.getByText("Loading admin session...")).toBeInTheDocument();
  });

  it("renders children when user is admin", () => {
    mockLoading = false;
    mockUser = { id: "1" };
    mockIsAdmin = true;
    render(<AdminGuard><p>Admin Content</p></AdminGuard>);
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    mockLoading = false;
    mockUser = null;
    mockIsAdmin = false;
    render(<AdminGuard><p>Content</p></AdminGuard>);
    expect(screen.getByText("Admin login required")).toBeInTheDocument();
  });

  it("shows access denied for non-admin users", () => {
    mockLoading = false;
    mockUser = { id: "1" };
    mockIsAdmin = false;
    render(<AdminGuard><p>Content</p></AdminGuard>);
    expect(screen.getByText("Access denied")).toBeInTheDocument();
  });
});
