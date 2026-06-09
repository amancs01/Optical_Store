import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FadeIn } from "@/components/ui/FadeIn";

describe("FadeIn", () => {
  it("renders children", () => {
    render(<FadeIn><p>Hello</p></FadeIn>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies visibility classes when immediate is true", () => {
    const { container } = render(<FadeIn immediate><p>Hello</p></FadeIn>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("is-visible");
    expect(div.className).toContain("opacity-100");
  });

  it("applies hidden classes when immediate is false", () => {
    const { container } = render(<FadeIn><p>Hello</p></FadeIn>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("opacity-0");
    expect(div.className).toContain("translate-y-4");
  });

  it("sets transition delay from prop", () => {
    const { container } = render(<FadeIn delay={200}><p>Hello</p></FadeIn>);
    const div = container.firstChild as HTMLElement;
    expect(div.style.transitionDelay).toBe("200ms");
  });

  it("accepts custom className", () => {
    const { container } = render(<FadeIn className="my-custom"><p>Hello</p></FadeIn>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("my-custom");
  });
});
