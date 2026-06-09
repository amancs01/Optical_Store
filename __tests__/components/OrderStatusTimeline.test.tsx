import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";

describe("OrderStatusTimeline", () => {
  it("renders all timeline steps for a valid status", () => {
    render(<OrderStatusTimeline orderStatus="pending" />);
    expect(screen.getByText("Order Placed")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("highlights first step for pending status", () => {
    render(<OrderStatusTimeline orderStatus="pending" />);
    expect(screen.getByText("Current step")).toBeInTheDocument();
  });

  it("renders cancelled message for cancelled status", () => {
    render(<OrderStatusTimeline orderStatus="cancelled" />);
    expect(screen.getByText("This order has been cancelled.")).toBeInTheDocument();
  });

  it("shows completed for steps before current", () => {
    render(<OrderStatusTimeline orderStatus="shipped" />);
    const completed = screen.getAllByText("Completed");
    expect(completed.length).toBeGreaterThanOrEqual(3);
  });

  it("shows upcoming for steps after current", () => {
    render(<OrderStatusTimeline orderStatus="confirmed" />);
    const upcoming = screen.getAllByText("Upcoming");
    expect(upcoming.length).toBeGreaterThanOrEqual(2);
  });
});
