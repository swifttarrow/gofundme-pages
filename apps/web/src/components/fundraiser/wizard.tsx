"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { ingestEvent, publishFundraiser } from "@/lib/api";

const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";
const DEFAULT_LOCATION = "Atlanta, GA";
const DEFAULT_FUNDRAISER_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop";
const STEPS = [
  { id: "basics", label: "General" },
  { id: "story", label: "Story" },
  { id: "review", label: "Review & publish" },
] as const;

const IMAGE_UPLOAD_CONSTRAINTS = {
  coverImageUrl: { maxWidth: 1600, maxHeight: 900, quality: 0.82 },
} as const;

type FormState = {
  title: string;
  category: string;
  goalAmount: string;
  location: string;
  coverImageUrl: string;
  summary: string;
  story: string;
  breakdownText: string;
  shareToCommunity: boolean;
  notifyFriends: boolean;
};

export function FundraiserWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "Emergency",
    goalAmount: "5000",
    location: DEFAULT_LOCATION,
    coverImageUrl: DEFAULT_FUNDRAISER_IMAGE,
    summary: "",
    story: "",
    breakdownText: "",
    shareToCommunity: true,
    notifyFriends: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const source = useMemo(() => {
    if (typeof window === "undefined") return "unknown";
    const url = new URL(window.location.href);
    return url.searchParams.get("source") ?? "primary_cta";
  }, []);

  const currentStep = STEPS[stepIndex];
  const breakdown = useMemo(
    () =>
      form.breakdownText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.breakdownText]
  );
  const goalAmountCents = Math.round(Number(form.goalAmount || "0") * 100);

  function isLocalImageSource(src: string) {
    return src.startsWith("data:") || src.startsWith("blob:");
  }

  function getScaledDimensions(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number
  ) {
    const scale = Math.min(maxWidth / width, maxHeight / height, 1);
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  }

  function readFileAsOptimizedDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new window.Image();

      image.onload = () => {
        const { maxWidth, maxHeight, quality } = IMAGE_UPLOAD_CONSTRAINTS.coverImageUrl;
        const { width, height } = getScaledDimensions(image.width, image.height, maxWidth, maxHeight);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Failed to prepare image upload."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        try {
          const dataUrl = canvas.toDataURL("image/webp", quality);
          URL.revokeObjectURL(objectUrl);
          resolve(dataUrl);
        } catch {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Failed to process image file."));
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to read image file."));
      };

      image.src = objectUrl;
    });
  }

  async function track(type: string, payload: Record<string, unknown>) {
    try {
      await ingestEvent({
        eventId: crypto.randomUUID(),
        type,
        occurredAt: new Date().toISOString(),
        payload: {
          source,
          step: currentStep.id,
          ...payload,
        },
      });
    } catch {
      // Telemetry should never block creation flow.
    }
  }

  useEffect(() => {
    void track("fundraiser.creation.step_viewed", { step: currentStep.id });
  }, [currentStep.id]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function getStepError(index: number) {
    if (index === 0) {
      if (!form.title.trim()) return "Add a fundraiser title to continue.";
      if (!form.category.trim()) return "Choose a category to continue.";
      if (!form.location.trim()) return "Add a location to continue.";
      if (!Number.isFinite(Number(form.goalAmount)) || Number(form.goalAmount) <= 0) {
        return "Enter a goal amount greater than zero.";
      }
    }

    if (index === 1) {
      if (form.summary.trim().length < 10) {
        return "Add a short summary so donors can quickly understand the need.";
      }
      if (form.story.trim().length < 30) {
        return "Add a fuller story with a bit more detail before reviewing.";
      }
    }

    return null;
  }

  function goBack() {
    setError(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function goNext() {
    const nextError = getStepError(stepIndex);
    if (nextError) {
      setError(nextError);
      return;
    }

    setError(null);
    void track("fundraiser.creation.step_completed", { step: currentStep.id });
    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function handleCoverImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsOptimizedDataUrl(file);
      updateField("coverImageUrl", dataUrl);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to process image upload.");
    } finally {
      event.target.value = "";
    }
  }

  async function publish() {
    const basicsError = getStepError(0);
    if (basicsError) {
      setError(basicsError);
      setStepIndex(0);
      return;
    }

    const storyError = getStepError(1);
    if (storyError) {
      setError(storyError);
      setStepIndex(1);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await publishFundraiser({
        organizerId: CURRENT_USER_ID,
        title: form.title.trim(),
        summary: form.summary.trim(),
        story: form.story.trim(),
        goalAmountCents,
        category: form.category.trim(),
        location: form.location.trim(),
        breakdown,
        distribution: {
          shareToCommunity: form.shareToCommunity,
          notifyFriends: form.notifyFriends,
        },
        coverImageUrl: form.coverImageUrl.trim() || undefined,
      });
      setShareUrl(result.shareUrl);
      setPublishedId(result.fundraiser.id);
      void track("fundraiser.creation.published", {
        fundraiserId: result.fundraiser.id,
        shareToCommunity: form.shareToCommunity,
        notifyFriends: form.notifyFriends,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Publishing failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyShareLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    void track("fundraiser.creation.share_copied", { fundraiserId: publishedId });
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Fundraiser starter</p>
        <h1 className="text-3xl font-semibold text-text-primary mt-2">Create your fundraiser</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          We&apos;ll guide you through the essentials, then let you review everything before you publish.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {STEPS.map((step, index) => {
          const isActive = index === stepIndex;
          const isComplete = index < stepIndex || publishedId !== null;
          return (
            <div
              key={step.id}
              className={`rounded-lg border px-3 py-3 ${
                isActive
                  ? "border-primary bg-primary-light"
                  : isComplete
                    ? "border-primary/30 bg-white"
                    : "border-border-light bg-white"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-text-muted">Step {index + 1}</p>
              <p className="text-sm font-semibold text-text-primary mt-1">{step.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border-light bg-white p-6 space-y-5">
        {stepIndex === 0 ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">General</h2>
              <p className="text-sm text-text-secondary mt-1">
                Start with the headline, category, goal, and location donors will see first.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Title <span className="text-accent-red">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                  placeholder="Help us recover after a house fire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Category <span className="text-accent-red">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>Emergency</option>
                  <option>Medical</option>
                  <option>Education</option>
                  <option>Memorial</option>
                  <option>Community</option>
                  <option>Nonprofit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Goal amount (USD) <span className="text-accent-red">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={form.goalAmount}
                  onChange={(event) => updateField("goalAmount", event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Location <span className="text-accent-red">*</span>
                </label>
                <input
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                  placeholder="City, State"
                />
              </div>
            </div>
          </>
        ) : null}

        {stepIndex === 1 ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">Story</h2>
              <p className="text-sm text-text-secondary mt-1">
                Explain what happened and how donations will help so supporters understand the need quickly.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Short summary <span className="text-accent-red">*</span>
              </label>
              <textarea
                value={form.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                rows={3}
                className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                placeholder="A short overview donors can scan in a few seconds."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Full story <span className="text-accent-red">*</span>
              </label>
              <textarea
                value={form.story}
                onChange={(event) => updateField("story", event.target.value)}
                rows={8}
                className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                placeholder="Share what happened, who needs help, and why support matters right now."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Backsplash image</label>
              <div className="rounded-lg border border-border-light bg-bg-faint p-3">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-white">
                  {isLocalImageSource(form.coverImageUrl) ? (
                    <img
                      src={form.coverImageUrl}
                      alt="Fundraiser backsplash preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={form.coverImageUrl}
                      alt="Fundraiser backsplash preview"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    id="fundraiser-backsplash-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => void handleCoverImageUpload(event)}
                  />
                  <label
                    htmlFor="fundraiser-backsplash-upload"
                    className="inline-flex cursor-pointer items-center rounded-md border border-border-medium bg-white px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint"
                  >
                    Upload image
                  </label>
                  <button
                    type="button"
                    onClick={() => updateField("coverImageUrl", DEFAULT_FUNDRAISER_IMAGE)}
                    className="inline-flex items-center rounded-md border border-border-medium bg-white px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-faint"
                  >
                    Reset image
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  This image will appear at the top of your fundraiser page.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Planned fund usage
              </label>
              <textarea
                value={form.breakdownText}
                onChange={(event) => updateField("breakdownText", event.target.value)}
                rows={4}
                className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                placeholder={"Temporary housing\nMedical bills\nGroceries and essentials"}
              />
              <p className="text-xs text-text-muted mt-2">Use one line per item if you want to show a simple breakdown.</p>
            </div>
          </>
        ) : null}

        {stepIndex === 2 ? (
          <>
            {publishedId ? (
              <div className="rounded-xl border border-primary/20 bg-primary-light p-6">
                <h2 className="text-2xl font-semibold text-primary-dark">Your fundraiser is live</h2>
                <p className="text-sm text-text-secondary mt-2">
                  Share it now to build momentum while the story is fresh.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
                  >
                    Copy link
                  </button>
                  <a
                    href={shareUrl ? `/fundraiser/${publishedId}` : "#"}
                    className="px-4 py-2 rounded-md border border-border-medium bg-white text-sm font-medium"
                  >
                    View fundraiser
                  </a>
                  <a
                    href={shareUrl ? `sms:?&body=${encodeURIComponent(`Check this out: ${shareUrl}`)}` : "#"}
                    className="px-4 py-2 rounded-md border border-border-medium bg-white text-sm font-medium"
                  >
                    Message contacts
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">Review & publish</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Double-check the story donors will see, then choose how you want to share it.
                  </p>
                </div>

                <div className="rounded-lg border border-border-light bg-bg-faint p-5">
                  <p className="text-xs uppercase tracking-wide text-text-muted">Preview</p>
                  <div className="relative mt-3 w-full aspect-[16/9] overflow-hidden rounded-lg bg-white">
                    <img
                      src={form.coverImageUrl}
                      alt={form.title || "Fundraiser cover preview"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-text-primary mt-2">{form.title || "Untitled fundraiser"}</h3>
                  <p className="text-sm text-text-secondary mt-2">{form.summary || "Add a short summary in Step 2."}</p>
                  <p className="text-sm text-text-secondary mt-4 whitespace-pre-wrap">
                    {form.story || "Add your full story in Step 2."}
                  </p>
                  <p className="text-sm text-text-muted mt-4">
                    Goal: ${Number(form.goalAmount || "0").toLocaleString()} · {form.category} · {form.location}
                  </p>
                  {breakdown.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-text-primary">Planned fund usage</p>
                      <ul className="mt-2 space-y-1 text-sm text-text-secondary list-disc pl-5">
                        {breakdown.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-border-light p-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={form.shareToCommunity}
                      onChange={(event) => updateField("shareToCommunity", event.target.checked)}
                    />
                    Share to community after publish
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={form.notifyFriends}
                      onChange={(event) => updateField("notifyFriends", event.target.checked)}
                    />
                    Notify friends
                  </label>
                </div>
              </>
            )}
          </>
        ) : null}

        {error ? <p className="text-sm text-accent-red">{error}</p> : null}

        {!publishedId ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="px-4 py-2 rounded-md border border-border-medium text-sm disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={stepIndex === STEPS.length - 1 ? publish : goNext}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-50"
            >
              {stepIndex === STEPS.length - 1 ? (isSubmitting ? "Publishing..." : "Publish fundraiser") : "Continue"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
