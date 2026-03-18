"use client";

import { useEffect, useState } from "react";
import {
  createCharityRequest,
  getCharityRequestEligibility,
} from "@/lib/api";

const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";

type Step = "loading" | "blocked" | "education" | "form" | "confirmation";

export function CharityWizard() {
  const [step, setStep] = useState<Step>("loading");
  const [error, setError] = useState<string | null>(null);
  const [charityName, setCharityName] = useState("");
  const [mission, setMission] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [fundUsage, setFundUsage] = useState("");
  const [location, setLocation] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    getCharityRequestEligibility(CURRENT_USER_ID)
      .then((result) => {
        if (result.state === "eligible") {
          setStep("education");
        } else {
          setStep("blocked");
        }
      })
      .catch(() => {
        setStep("education");
      });
  }, []);

  async function submit() {
    setError(null);
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
        userId: CURRENT_USER_ID,
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

  if (step === "loading") {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <p className="text-sm text-text-secondary">Checking your charity creation eligibility...</p>
      </div>
    );
  }

  if (step === "blocked") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Request already in progress</h2>
          <p className="text-sm text-amber-800">
            You can only create one charity at a time. Your current request is still in progress.
          </p>
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
            onClick={() => setStep("form")}
            className="mt-5 px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="rounded-xl border border-border-light bg-white p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-text-primary">Submit your charity request</h1>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Charity name *</label>
          <input
            value={charityName}
            onChange={(event) => setCharityName(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Mission / purpose *</label>
          <textarea
            value={mission}
            onChange={(event) => setMission(event.target.value)}
            rows={3}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="What problem are you trying to solve?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Who or what will be helped *
          </label>
          <input
            value={beneficiaries}
            onChange={(event) => setBeneficiaries(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            How funds will be used *
          </label>
          <textarea
            value={fundUsage}
            onChange={(event) => setFundUsage(event.target.value)}
            rows={3}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="Be specific (food, shelter, medical supplies, etc.)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Location *</label>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            placeholder="City / Region"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Cover image URL</label>
          <input
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
