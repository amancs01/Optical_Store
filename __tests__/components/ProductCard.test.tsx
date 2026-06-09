import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/product/ProductCard";

const baseProduct = {
  id: "1", name: "Classic Frame", slug: "classic-frame", description: null,
  brand: "Titan", category: "Eyeglasses", gender: "Men", frame_type: "Full Rim",
  shape: "Rectangle", material: "Metal", color: "Black",
  price: 5000, discount_price: null, stock_quantity: 10,
  image_url: "/test.jpg", is_active: true, is_featured: false,
  created_at: "2025-01-01T00:00:00Z", updated_at: null,
};

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/components/product/AddToCartButton", () => ({
  AddToCartButton: ({ product, compact }: any) => (
    <button data-testid="add-to-cart" data-compact={compact}>Add to Cart</button>
  ),
}));

describe("ProductCard", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("renders product name and price", () => {
    render(<ProductCard product={baseProduct} />);
    const nameLinks = screen.getAllByRole("link", { name: "Classic Frame" });
    expect(nameLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/5,000/)).toBeInTheDocument();
  });

  it("renders brand", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Titan")).toBeInTheDocument();
  });

  it("renders sale badge when discount_price exists", () => {
    render(<ProductCard product={{ ...baseProduct, discount_price: 4000 }} />);
    expect(screen.getByText("Sale")).toBeInTheDocument();
  });

  it("does not render sale badge without discount", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.queryByText("Sale")).not.toBeInTheDocument();
  });

  it("shows discounted price with strikethrough original", () => {
    render(<ProductCard product={{ ...baseProduct, discount_price: 4000 }} />);
    expect(screen.getByText(/4,000/)).toBeInTheDocument();
    const originalPrice = screen.getByText(/5,000/);
    expect(originalPrice.className).toContain("line-through");
  });

  it("renders product image when image_url is set", () => {
    render(<ProductCard product={baseProduct} />);
    const img = screen.getByAltText("Classic Frame");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("renders fallback when image_url is null", () => {
    render(<ProductCard product={{ ...baseProduct, image_url: null }} />);
    expect(screen.getByText("Titan Optical")).toBeInTheDocument();
    const nameElements = screen.getAllByText("Classic Frame");
    expect(nameElements.length).toBeGreaterThanOrEqual(1);
  });

  it("links to product detail page", () => {
    render(<ProductCard product={baseProduct} />);
    const links = screen.getAllByRole("link");
    const productLink = links.find((l) => l.getAttribute("href") === "/products/classic-frame");
    expect(productLink).toBeTruthy();
  });

  it("shows out of stock status when stock is 0", () => {
    render(<ProductCard product={{ ...baseProduct, stock_quantity: 0 }} />);
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("shows limited stock status when stock is 1-3", () => {
    render(<ProductCard product={{ ...baseProduct, stock_quantity: 2 }} />);
    expect(screen.getByText("Limited stock")).toBeInTheDocument();
  });

  it("renders AddToCartButton", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId("add-to-cart")).toBeInTheDocument();
  });
});
