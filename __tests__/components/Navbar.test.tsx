import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/layout/Navbar";

const mockUsePathname = vi.fn(() => "/");
const mockCartCount = 0;
const mockCartHydrated = false;

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/components/cart/CartProvider", () => ({
  useCart: () => ({ count: mockCartCount, hydrated: mockCartHydrated }),
}));

vi.mock("@/lib/auth/admin", () => ({
  useCurrentUser: () => ({ user: null, isAdmin: false, signOut: vi.fn() }),
}));

vi.mock("@/components/ui/HoverDropdown", () => ({
  HoverDropdown: ({ label }: any) => <span data-testid="hover-dropdown">{label}</span>,
}));

describe("Navbar", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("renders site name", () => {
    render(<Navbar />);
    expect(screen.getByText("Titan Optical")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders cart link", () => {
    render(<Navbar />);
    const cartLink = screen.getByLabelText("Cart");
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("does not show badge when count is 0", () => {
    render(<Navbar />);
    const badge = screen.queryByText("0");
    expect(badge).not.toBeInTheDocument();
  });

  it("shows login button when user is not authenticated", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Account")).toBeInTheDocument();
  });
});
