import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { Product } from "@/types/product";

const mockAddProduct = vi.fn();

vi.mock("@/components/cart/CartProvider", () => ({
  useCart: () => ({ addProduct: mockAddProduct }),
}));

vi.mock("@/components/ui/Button", () => ({
  Button: ({ children, disabled, onClick, className }: any) => (
    <button disabled={disabled} onClick={onClick} className={className} data-testid="add-btn">
      {children}
    </button>
  ),
}));

const baseProduct: Product = {
  id: "1", name: "Frame", slug: "frame", description: null,
  brand: "Titan", category: "Eyeglasses", gender: null, frame_type: null,
  shape: null, material: null, color: null,
  price: 5000, discount_price: null, stock_quantity: 10,
  image_url: null, is_active: true, is_featured: false,
  created_at: "2025-01-01T00:00:00Z", updated_at: null,
};

describe("AddToCartButton", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('shows "Add to Cart" for default variant', () => {
    render(<AddToCartButton product={baseProduct} />);
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it('shows "Add" for compact variant', () => {
    render(<AddToCartButton product={baseProduct} compact />);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it('shows "Out of Stock" when stock is 0', () => {
    render(<AddToCartButton product={{ ...baseProduct, stock_quantity: 0 }} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("disables button when out of stock", () => {
    render(<AddToCartButton product={{ ...baseProduct, stock_quantity: 0 }} />);
    expect(screen.getByTestId("add-btn")).toBeDisabled();
  });

  it("calls addProduct on click", async () => {
    const userEvent = (await import("@testing-library/user-event")).default;
    render(<AddToCartButton product={baseProduct} />);
    await userEvent.click(screen.getByTestId("add-btn"));
    expect(mockAddProduct).toHaveBeenCalledWith(baseProduct);
  });
});
