"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const charity_request_state_1 = require("../services/charity-request-state");
(0, vitest_1.describe)("charity request state machine", () => {
    (0, vitest_1.it)("allows under_review to approve/reject", () => {
        (0, vitest_1.expect)((0, charity_request_state_1.canTransition)("under_review", "approve")).toBe(true);
        (0, vitest_1.expect)((0, charity_request_state_1.canTransition)("under_review", "reject")).toBe(true);
    });
    (0, vitest_1.it)("rejects invalid transitions", () => {
        (0, vitest_1.expect)((0, charity_request_state_1.canTransition)("approved", "reject")).toBe(false);
        (0, vitest_1.expect)(() => (0, charity_request_state_1.nextStatus)("approved", "reject")).toThrow();
    });
    (0, vitest_1.it)("supports rejected to resubmit back under_review", () => {
        (0, vitest_1.expect)((0, charity_request_state_1.canTransition)("rejected", "resubmit")).toBe(true);
        (0, vitest_1.expect)((0, charity_request_state_1.nextStatus)("rejected", "resubmit")).toBe("under_review");
    });
});
(0, vitest_1.describe)("charity request eligibility", () => {
    (0, vitest_1.it)("returns under_review priority over active community", () => {
        const state = (0, charity_request_state_1.normalizeEligibilityState)({
            hasUnderReviewRequest: true,
            hasActiveCommunity: true,
        });
        (0, vitest_1.expect)(state).toBe("under_review");
    });
    (0, vitest_1.it)("returns active_community when no pending request", () => {
        const state = (0, charity_request_state_1.normalizeEligibilityState)({
            hasUnderReviewRequest: false,
            hasActiveCommunity: true,
        });
        (0, vitest_1.expect)(state).toBe("active_community");
    });
    (0, vitest_1.it)("returns eligible when both constraints are absent", () => {
        const state = (0, charity_request_state_1.normalizeEligibilityState)({
            hasUnderReviewRequest: false,
            hasActiveCommunity: false,
        });
        (0, vitest_1.expect)(state).toBe("eligible");
    });
});
