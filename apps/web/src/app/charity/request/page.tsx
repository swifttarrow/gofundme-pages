"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getMyCharityRequest, resubmitCharityRequest } from "@/lib/api";

export default function CharityRequestStatusPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [request, setRequest] = useState<{
    id: string;
    status: "under_review" | "approved" | "rejected";
    decision_reason: string | null;
    charity_name: string;
    mission: string;
    beneficiaries: string;
    fund_usage: string;
    location: string;
    cover_image_url: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        setCurrentUserId(response.user.id);
        return getMyCharityRequest(response.user.id);
      })
      .then((response) => setRequest(response))
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : "Unable to load your request.")
      );
  }, []);

  async function handleResubmit() {
    if (!request || !currentUserId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await resubmitCharityRequest(request.id, {
        userId: currentUserId,
        charityName: request.charity_name,
        mission: request.mission,
        beneficiaries: request.beneficiaries,
        fundUsage: request.fund_usage,
        location: request.location,
        coverImageUrl: request.cover_image_url ?? undefined,
      });
      const latest = await getMyCharityRequest(currentUserId);
      setRequest(latest);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Resubmission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold text-text-primary mb-4">Your Charity Request</h1>
      {error ? <p className="text-sm text-accent-red mb-3">{error}</p> : null}
      {!request ? (
        <p className="text-sm text-text-secondary">{error ? "We couldn't load your request." : "Loading status..."}</p>
      ) : (
        <div className="rounded-lg border border-border-light bg-white p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Status</p>
            <p className="text-sm font-semibold text-text-primary">{request.status.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Charity</p>
            <p className="text-sm text-text-primary">{request.charity_name}</p>
          </div>
          {request.status === "approved" ? (
            <p className="text-sm text-primary font-medium">
              Your charity is live. Start sharing it.
            </p>
          ) : null}
          {request.status === "rejected" ? (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                Reason: {request.decision_reason ?? "No reason provided."}
              </p>
              <button
                type="button"
                onClick={handleResubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Resubmitting..." : "Edit and Resubmit"}
              </button>
            </div>
          ) : null}
          {request.status === "under_review" ? (
            <p className="text-sm text-text-secondary">
              We may reach out for more information. Typical review time: 1-3 days.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
