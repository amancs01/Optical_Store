import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomNav } from "@/components/layout/BottomNav";

const mockUsePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/components/cart/CartProvider", () => ({
  useCart: () => ({ count: 0, hydrated: false }),
}));

describe("BottomNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  it("renders all navigation items", () => {
    render(<BottomNav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("renders cart link", () => {
    render(<BottomNav />);
    const cartLink = screen.getByText("Cart").closest("a");
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("does not render on admin pages", () => {
    mockUsePathname.mockReturnValue("/admin/products");
    const { container } = render(<BottomNav />);
    expect(container.innerHTML).toBe("");
  });

  it("renders shop link", () => {
    render(<BottomNav />);
    const shopLink = screen.getByText("Shop").closest("a");
    expect(shopLink).toHaveAttribute("href", "/products");
  });
});
