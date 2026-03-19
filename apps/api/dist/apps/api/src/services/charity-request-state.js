"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canTransition = canTransition;
exports.nextStatus = nextStatus;
exports.normalizeEligibilityState = normalizeEligibilityState;
const LEGAL_TRANSITIONS = {
    under_review: ["approve", "reject"],
    approved: [],
    rejected: ["resubmit"],
};
function canTransition(status, decision) {
    return LEGAL_TRANSITIONS[status].includes(decision);
}
function nextStatus(status, decision) {
    if (!canTransition(status, decision)) {
        throw new Error(`Invalid transition from ${status} via ${decision}`);
    }
    if (decision === "approve")
        return "approved";
    if (decision === "reject")
        return "rejected";
    return "under_review";
}
function normalizeEligibilityState(params) {
    if (params.hasUnderReviewRequest)
        return "under_review";
    if (params.hasActiveCommunity)
        return "active_community";
    return "eligible";
}
