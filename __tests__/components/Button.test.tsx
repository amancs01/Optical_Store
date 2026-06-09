import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, LinkButton } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByText("Save");
    expect(btn.className).toContain("bg-emerald-700");
  });

  it("applies secondary variant", () => {
    render(<Button variant="secondary">Cancel</Button>);
    const btn = screen.getByText("Cancel");
    expect(btn.className).toContain("border-emerald-200");
  });

  it("applies danger variant", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByText("Delete");
    expect(btn.className).toContain("bg-rose-600");
  });

  it("applies ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText("Ghost").className).toContain("hover:bg-emerald-50");
  });

  it("forwards disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("fires onClick handler", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByText("Click"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("accepts custom className", () => {
    render(<Button className="custom-class">Styled</Button>);
    expect(screen.getByText("Styled").className).toContain("custom-class");
  });
});

describe("LinkButton", () => {
  it("renders as a link with href", () => {
    render(<LinkButton href="/test">Go</LinkButton>);
    const link = screen.getByText("Go");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies primary variant by default", () => {
    render(<LinkButton href="/">Primary</LinkButton>);
    expect(screen.getByText("Primary").className).toContain("bg-emerald-700");
  });

  it("applies secondary variant", () => {
    render(<LinkButton href="/" variant="secondary">Secondary</LinkButton>);
    expect(screen.getByText("Secondary").className).toContain("border-emerald-200");
  });
});
