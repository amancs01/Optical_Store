import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types/product";

const frame: Product = {
  id: "f1", name: "Classic Frame", slug: "classic-frame", description: null,
  brand: "Titan", category: "Eyeglasses", gender: "Men", frame_type: "Full Rim",
  shape: "Rectangle", material: "Metal", color: "Black",
  price: 5000, discount_price: 4000, stock_quantity: 10,
  image_url: "/frame.jpg", is_active: true, is_featured: false,
  created_at: "2025-01-01T00:00:00Z", updated_at: null,
};

const sunglasses: Product = {
  id: "s1", name: "Aviator Sunglasses", slug: "aviator-sunglasses", description: null,
  brand: "Titan", category: "Sunglasses", gender: "Unisex", frame_type: "Full Rim",
  shape: "Aviator", material: "Metal", color: "Gold",
  price: 8000, discount_price: null, stock_quantity: 5,
  image_url: "/aviator.jpg", is_active: true, is_featured: true,
  created_at: "2025-01-02T00:00:00Z", updated_at: null,
};

function CartDisplay() {
  const { items, count, subtotal, addProduct, increment, decrement, remove, clear } = useCart();
  return (
    <div>
      <p data-testid="count">{count}</p>
      <p data-testid="subtotal">{subtotal}</p>
      <ul data-testid="items">
        {items.map((item) => (
          <li key={item.productId} data-testid={`item-${item.productId}`}>
            {item.name} x{item.quantity}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p data-testid="empty">Cart is empty</p>}
      <button data-testid="add-frame" onClick={() => addProduct(frame)}>Add Frame</button>
      <button data-testid="add-sunglasses" onClick={() => addProduct(sunglasses)}>Add Sunglasses</button>
      <button data-testid="inc-frame" onClick={() => increment("f1")}>+ Frame</button>
      <button data-testid="dec-frame" onClick={() => decrement("f1")}>- Frame</button>
      <button data-testid="remove-frame" onClick={() => remove("f1")}>Remove Frame</button>
      <button data-testid="clear-cart" onClick={() => clear()}>Clear</button>
    </div>
  );
}

function flushMicrotasks() {
  return act(() => new Promise<void>((r) => window.queueMicrotask(() => r())));
}

describe("Cart Integration Flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts with empty cart", () => {
    render(<CartDisplay />, { wrapper: CartProvider });
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("subtotal").textContent).toBe("0");
  });

  it("adds a product and updates count and subtotal", async () => {
    render(<CartDisplay />, { wrapper: CartProvider });
    await userEvent.click(screen.getByTestId("add-frame"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("subtotal").textContent).toBe("4000");
  });

  it("adds multiple products to the cart", async () => {
    render(<CartDisplay />, { wrapper: CartProvider });
    await userEvent.click(screen.getByTestId("add-frame"));
    await userEvent.click(screen.getByTestId("add-sunglasses"));
    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("subtotal").textContent).toBe("12000");
    expect(screen.getByTestId("item-f1")).toBeInTheDocument();
    expect(screen.getByTestId("item-s1")).toBeInTheDocument();
  });

  it("increments and decrements quantity", async () => {
    render(<CartDisplay />, { wrapper: CartProvider });
    await userEvent.click(screen.getByTestId("add-frame"));
    await userEvent.click(screen.getByTestId("inc-frame"));
    expect(screen.getByTestId("count").textContent).toBe("2");
    await userEvent.click(screen.getByTestId("dec-frame"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("removes item from cart", async () => {
    render(<CartDisplay />, { wrapper: CartProvider });
    await userEvent.click(screen.getByTestId("add-frame"));
    await userEvent.click(screen.getByTestId("remove-frame"));
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("clears entire cart", async () => {
    render(<CartDisplay />, { wrapper: CartProvider });
    await userEvent.click(screen.getByTestId("add-frame"));
    await userEvent.click(screen.getByTestId("add-sunglasses"));
    await userEvent.click(screen.getByTestId("clear-cart"));
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("persists cart across re-renders", async () => {
    const { unmount } = render(<CartDisplay />, { wrapper: CartProvider });
    await userEvent.click(screen.getByTestId("add-frame"));
    await userEvent.click(screen.getByTestId("add-sunglasses"));
    await flushMicrotasks();
    expect(screen.getByTestId("count").textContent).toBe("2");
    unmount();

    const { getByTestId } = render(<CartDisplay />, { wrapper: CartProvider });
    await flushMicrotasks();
    expect(getByTestId("count").textContent).toBe("2");
    expect(getByTestId("item-f1")).toBeInTheDocument();
    expect(getByTestId("item-s1")).toBeInTheDocument();
  });
});
