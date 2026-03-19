"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  createCharityRequest,
  getCurrentUser,
  getCharityRequestEligibility,
} from "@/lib/api";

type Step = "loading" | "blocked" | "education" | "form" | "confirmation";
type EligibilityState = "eligible" | "under_review" | "active_community";

export function CharityWizard() {
  const [step, setStep] = useState<Step>("loading");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [eligibilityState, setEligibilityState] = useState<EligibilityState | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charityName, setCharityName] = useState("");
  const [mission, setMission] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [fundUsage, setFundUsage] = useState("");
  const [location, setLocation] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((auth) => {
        setCurrentUserId(auth.user.id);
        return getCharityRequestEligibility(auth.user.id);
      })
      .then((result) => {
        setEligibilityState(result.state);
        setStep(result.state === "eligible" ? "education" : "blocked");
      })
      .catch(() => {
        setEligibilityState(null);
        setStep("education");
        setError("We could not verify your charity eligibility right now.");
      });
  }, []);

  async function submit() {
    setError(null);
    if (!currentUserId) {
      setError("We could not verify your account. Please refresh and try again.");
      return;
    }

    try {
      const result = await getCharityRequestEligibility(currentUserId);
      setEligibilityState(result.state);
      if (result.state !== "eligible") {
        setStep("blocked");
        return;
      }
    } catch {
      setError("We could not verify your eligibility right now. Please try again.");
      return;
    }

    if (
      !charityName.trim() ||
      !mission.trim() ||
      !beneficiaries.trim() ||
      !fundUsage.trim() ||
      !location.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }
    try {
      await createCharityRequest({
        userId: currentUserId,
        charityName: charityName.trim(),
        mission: mission.trim(),
        beneficiaries: beneficiaries.trim(),
        fundUsage: fundUsage.trim(),
        location: location.trim(),
        coverImageUrl: coverImageUrl.trim() || undefined,
        idempotencyKey: crypto.randomUUID(),
      });
      setStep("confirmation");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit request right now.");
    }
  }

  async function handleContinue() {
    if (isContinuing) return;
    if (!currentUserId) {
      setError("We could not verify your account. Please refresh and try again.");
      return;
    }

    setError(null);
    setIsContinuing(true);

    try {
      const result = await getCharityRequestEligibility(currentUserId);
      setEligibilityState(result.state);
      if (result.state !== "eligible") {
        setStep("blocked");
        return;
      }
      setStep("form");
    } catch {
      setError("We could not verify your eligibility right now. Please try again.");
    } finally {
      setIsContinuing(false);
    }
  }

  if (step === "loading") {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <p className="text-sm text-text-secondary">Checking your charity creation eligibility...</p>
      </div>
    );
  }

  if (step === "blocked") {
    const title =
      eligibilityState === "active_community"
        ? "Your community is already active"
        : "Request already in progress";
    const description =
      eligibilityState === "active_community"
        ? "You already have an active community, so you cannot submit another charity request from this page."
        : "You already have a charity request under review. To prevent duplicate reviews, you cannot submit another request until this one is completed.";

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-xl font-semibold text-amber-900 mb-2">{title}</h2>
          <p className="text-sm text-amber-800">{description}</p>
          <div className="mt-4">
            <Link
              href="/charity/request"
              className="inline-flex rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 transition-colors"
            >
              View your charity request
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-lg border border-primary/20 bg-primary-light p-5">
          <h2 className="text-xl font-semibold text-primary-dark mb-2">
            Your charity request is under review
          </h2>
          <p className="text-sm text-text-secondary">
            Estimated review time is 1-3 days. We may reach out for more information and we will notify
            you when your request is approved or rejected.
          </p>
        </div>
      </div>
    );
  }

  if (step === "education") {
    const isContinueDisabled =
      !currentUserId || eligibilityState !== "eligible" || isContinuing;
    console.log("currentUserId: ", currentUserId);
    console.log("eligibilityState: ", eligibilityState);
    console.log("isContinuing: ", isContinuing);
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="rounded-xl border border-border-light bg-white p-6">
          <h1 className="text-2xl font-semibold text-text-primary mb-3">
            We help you get your charity started
          </h1>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>✅ Collect donations securely</p>
            <p>✅ Host your charity page</p>
            <p>✅ Provide basic transparency tools</p>
            <p>⚠️ You are responsible for how funds are used</p>
            <p>⚠️ This is reviewed before going live</p>
          </div>
          <button
            type="button"
            onClick={() => void handleContinue()}
            disabled={isContinueDisabled}
            className="mt-5 px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isContinuing ? "Checking eligibility..." : "Continue"}
          </button>
          {error ? <p className="mt-3 text-sm text-accent-red">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="rounded-xl border border-border-light bg-white p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-text-primary">Submit your charity request</h1>
        <div>
          <label
            htmlFor="charity-request-name"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Charity name *
          </label>
          <input
            id="charity-request-name"
            value={charityName}
            onChange={(event) => setCharityName(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="charity-request-mission"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Mission / purpose *
          </label>
          <textarea
            id="charity-request-mission"
            value={mission}
            onChange={(event) => setMission(event.target.value)}
            rows={3}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="What problem are you trying to solve?"
          />
        </div>
        <div>
          <label
            htmlFor="charity-request-beneficiaries"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Who or what will be helped *
          </label>
          <input
            id="charity-request-beneficiaries"
            value={beneficiaries}
            onChange={(event) => setBeneficiaries(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="charity-request-fund-usage"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            How funds will be used *
          </label>
          <textarea
            id="charity-request-fund-usage"
            value={fundUsage}
            onChange={(event) => setFundUsage(event.target.value)}
            rows={3}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="Be specific (food, shelter, medical supplies, etc.)"
          />
        </div>
        <div>
          <label
            htmlFor="charity-request-location"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Location *
          </label>
          <input
            id="charity-request-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="City / Region"
          />
        </div>
        <div>
          <label
            htmlFor="charity-request-cover-image"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Cover image URL
          </label>
          <input
            id="charity-request-cover-image"
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>
        {error ? <p className="text-sm text-accent-red">{error}</p> : null}
        <button
          type="button"
          onClick={submit}
          className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
        >
          Submit for review
        </button>
      </div>
    </div>
  );
}
