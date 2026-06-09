import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StateMessage } from "@/components/ui/StateMessage";

describe("StateMessage", () => {
  it("renders title and message", () => {
    render(<StateMessage title="Error" message="Something went wrong." />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders with long messages", () => {
    render(<StateMessage title="Notice" message={"A".repeat(500)} />);
    expect(screen.getByText("Notice")).toBeInTheDocument();
  });
});
