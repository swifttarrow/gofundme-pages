export type CharityRequestStatus = "under_review" | "approved" | "rejected";
export type CharityDecision = "approve" | "reject" | "resubmit";

const LEGAL_TRANSITIONS: Record<CharityRequestStatus, CharityDecision[]> = {
  under_review: ["approve", "reject"],
  approved: [],
  rejected: ["resubmit"],
};

export function canTransition(status: CharityRequestStatus, decision: CharityDecision): boolean {
  return LEGAL_TRANSITIONS[status].includes(decision);
}

export function nextStatus(
  status: CharityRequestStatus,
  decision: CharityDecision
): CharityRequestStatus {
  if (!canTransition(status, decision)) {
    throw new Error(`Invalid transition from ${status} via ${decision}`);
  }
  if (decision === "approve") return "approved";
  if (decision === "reject") return "rejected";
  return "under_review";
}

export function normalizeEligibilityState(params: {
  hasUnderReviewRequest: boolean;
  hasActiveCharity: boolean;
}): "eligible" | "under_review" | "active_charity" {
  if (params.hasUnderReviewRequest) return "under_review";
  if (params.hasActiveCharity) return "active_charity";
  return "eligible";
}
