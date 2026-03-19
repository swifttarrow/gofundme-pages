import { describe, expect, it } from "vitest";
import {
  canTransition,
  nextStatus,
  normalizeEligibilityState,
} from "../services/charity-request-state";

describe("charity request state machine", () => {
  it("allows under_review to approve/reject", () => {
    expect(canTransition("under_review", "approve")).toBe(true);
    expect(canTransition("under_review", "reject")).toBe(true);
  });

  it("rejects invalid transitions", () => {
    expect(canTransition("approved", "reject")).toBe(false);
    expect(() => nextStatus("approved", "reject")).toThrow();
  });

  it("supports rejected to resubmit back under_review", () => {
    expect(canTransition("rejected", "resubmit")).toBe(true);
    expect(nextStatus("rejected", "resubmit")).toBe("under_review");
  });
});

describe("charity request eligibility", () => {
  it("returns under_review priority over active community", () => {
    const state = normalizeEligibilityState({
      hasUnderReviewRequest: true,
      hasActiveCommunity: true,
    });
    expect(state).toBe("under_review");
  });

  it("returns active_community when no pending request", () => {
    const state = normalizeEligibilityState({
      hasUnderReviewRequest: false,
      hasActiveCommunity: true,
    });
    expect(state).toBe("active_community");
  });

  it("returns eligible when both constraints are absent", () => {
    const state = normalizeEligibilityState({
      hasUnderReviewRequest: false,
      hasActiveCommunity: false,
    });
    expect(state).toBe("eligible");
  });
});
