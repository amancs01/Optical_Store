import { describe, it, expect } from "vitest";
import { orderTimelineSteps, formatOrderStatus, getCurrentStepIndex } from "@/lib/orderStatus";

describe("orderTimelineSteps", () => {
  it("has 5 steps", () => {
    expect(orderTimelineSteps).toHaveLength(5);
  });

  it('starts with "pending"', () => {
    expect(orderTimelineSteps[0].status).toBe("pending");
  });

  it('ends with "delivered"', () => {
    expect(orderTimelineSteps[orderTimelineSteps.length - 1].status).toBe("delivered");
  });

  it("each step has status and label", () => {
    for (const step of orderTimelineSteps) {
      expect(step.status).toBeTruthy();
      expect(step.label).toBeTruthy();
    }
  });
});

describe("formatOrderStatus", () => {
  it("formats pending", () => {
    expect(formatOrderStatus("pending")).toBe("Pending");
  });

  it("formats confirmed", () => {
    expect(formatOrderStatus("confirmed")).toBe("Confirmed");
  });

  it("formats processing", () => {
    expect(formatOrderStatus("processing")).toBe("Processing");
  });

  it("formats shipped", () => {
    expect(formatOrderStatus("shipped")).toBe("Shipped");
  });

  it("formats delivered", () => {
    expect(formatOrderStatus("delivered")).toBe("Delivered");
  });

  it("formats cancelled", () => {
    expect(formatOrderStatus("cancelled")).toBe("Cancelled");
  });

  it("returns unknown status as-is", () => {
    expect(formatOrderStatus("unknown")).toBe("unknown");
  });

  it("handles empty string", () => {
    expect(formatOrderStatus("")).toBe("");
  });
});

describe("getCurrentStepIndex", () => {
  it("returns 0 for pending", () => {
    expect(getCurrentStepIndex("pending")).toBe(0);
  });

  it("returns 2 for processing", () => {
    expect(getCurrentStepIndex("processing")).toBe(2);
  });

  it("returns 4 for delivered", () => {
    expect(getCurrentStepIndex("delivered")).toBe(4);
  });

  it("returns -1 for cancelled", () => {
    expect(getCurrentStepIndex("cancelled")).toBe(-1);
  });

  it("returns -1 for unknown status", () => {
    expect(getCurrentStepIndex("nonexistent")).toBe(-1);
  });
});
