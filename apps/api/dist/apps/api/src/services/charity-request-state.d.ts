export type CharityRequestStatus = "under_review" | "approved" | "rejected";
export type CharityDecision = "approve" | "reject" | "resubmit";
export declare function canTransition(status: CharityRequestStatus, decision: CharityDecision): boolean;
export declare function nextStatus(status: CharityRequestStatus, decision: CharityDecision): CharityRequestStatus;
export declare function normalizeEligibilityState(params: {
    hasUnderReviewRequest: boolean;
    hasActiveCommunity: boolean;
}): "eligible" | "under_review" | "active_community";
