"use client";

import { useEffect, useMemo, useState } from "react";
import {
  VoiceDraft,
  createVoiceDraft,
  ingestEvent,
  publishFundraiser,
  regenerateVoiceDraft,
} from "@/lib/api";

const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";
const ROTATING_PROMPTS = ["What happened?", "Who is this for?", "How will funds be used?"];
const TONES: Array<"emotional" | "direct" | "detailed"> = ["emotional", "direct", "detailed"];
const DEFAULT_LOCATION = "Atlanta, GA";

type FlowStage =
  | "entry"
  | "recording"
  | "processing"
  | "review"
  | "publish"
  | "success";

export function FundraiserWizard() {
  const [stage, setStage] = useState<FlowStage>("entry");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [typingMode, setTypingMode] = useState(false);
  const [typingInput, setTypingInput] = useState("");
  const [recordingTranscript, setRecordingTranscript] = useState("");
  const [draft, setDraft] = useState<VoiceDraft | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [tone, setTone] = useState<"emotional" | "direct" | "detailed">("emotional");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [shareToCommunity, setShareToCommunity] = useState(true);
  const [notifyFriends, setNotifyFriends] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const source = useMemo(() => {
    if (typeof window === "undefined") return "unknown";
    const url = new URL(window.location.href);
    return url.searchParams.get("source") ?? "primary_cta";
  }, []);

  async function track(type: string, payload: Record<string, unknown>) {
    try {
      await ingestEvent({
        eventId: crypto.randomUUID(),
        type,
        occurredAt: new Date().toISOString(),
        payload: {
          source,
          stage,
          ...payload,
        },
      });
    } catch {
      // Telemetry should never block the flow.
    }
  }

  function beginRecording() {
    setError(null);
    setTypingMode(false);
    setStage("recording");
    setRecordingSeconds(0);
    setRecordingTranscript("");
    void track("voice.recording.started", {});
  }

  useEffect(() => {
    if (stage !== "recording" || isPaused) return;
    const timeout = window.setTimeout(() => {
      setRecordingSeconds((value) => {
        const next = value + 1;
        if (next >= 90) {
          setIsPaused(true);
        }
        return Math.min(next, 90);
      });
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [isPaused, stage, recordingSeconds]);

  function pauseOrResume() {
    setIsPaused((value) => !value);
  }

  function retryRecording() {
    setRecordingSeconds(0);
    setRecordingTranscript("");
    setIsPaused(false);
    setError(null);
  }

  async function moveToProcessing() {
    setError(null);
    const transcript =
      typingMode || recordingTranscript.trim().length > 0
        ? (typingMode ? typingInput : recordingTranscript).trim()
        : `I need urgent support for my family and basic expenses. We need around $5000 for short-term recovery.`;

    if (!transcript) {
      setError("Please record or type a short story before continuing.");
      return;
    }

    setStage("processing");
    void track("voice.processing.started", { inputType: typingMode ? "typing" : "voice" });
    try {
      const result = await createVoiceDraft({
        inputType: typingMode ? "typing" : "voice",
        transcript,
        recordingSeconds: typingMode ? undefined : recordingSeconds,
        source,
      });
      setDraftId(result.draftId);
      setDraft(result.draft);
      setStage("review");
      void track("voice.processing.completed", {
        confidence: result.draft.confidence,
        lowConfidence: result.draft.lowConfidence,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to process your story right now.");
      setStage(typingMode ? "entry" : "recording");
      void track("voice.processing.failed", {});
    }
  }

  async function regenerate(section: "title" | "summary" | "story" | "breakdown") {
    if (!draftId) return;
    try {
      const result = await regenerateVoiceDraft({
        draftId,
        section,
        tone,
      });
      setDraft(result.draft);
      void track("voice.review.regenerated", { section, tone });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not regenerate section.");
    }
  }

  function startOverWithVoice() {
    setDraft(null);
    setDraftId(null);
    setTypingInput("");
    setRecordingTranscript("");
    setTypingMode(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setStage("entry");
    setError(null);
    void track("voice.review.start_over", {});
  }

  async function publish() {
    if (!draft) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await publishFundraiser({
        organizerId: CURRENT_USER_ID,
        title: draft.title,
        summary: draft.summary,
        story: draft.story,
        goalAmountCents: draft.goalAmountCents,
        category: draft.category,
        location,
        breakdown: draft.breakdown,
        distribution: {
          shareToCommunity,
          notifyFriends,
        },
      });
      setShareUrl(result.shareUrl);
      setPublishedId(result.fundraiser.id);
      setStage("success");
      void track("voice.publish.completed", {
        fundraiserId: result.fundraiser.id,
        shareToCommunity,
        notifyFriends,
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
    void track("voice.share.copy_link", { fundraiserId: publishedId });
  }

  const prompt = ROTATING_PROMPTS[Math.floor(recordingSeconds / 8) % ROTATING_PROMPTS.length];
  const softCapReached = recordingSeconds >= 60;

  if (stage === "processing") {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Turning your story into a fundraiser...
        </h2>
        <p className="text-sm text-text-secondary">Hang tight, this usually takes a few seconds.</p>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-primary/20 bg-primary-light p-6">
          <h2 className="text-2xl font-semibold text-primary-dark mb-2">
            Your fundraiser is live!
          </h2>
          <p className="text-sm text-text-secondary mb-5">
            Share it now to build momentum in the first few minutes.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyShareLink}
              className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
            >
              Copy link
            </button>
            <a
              href={shareUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareUrl)}` : "#"}
              className="px-4 py-2 rounded-md border border-border-medium bg-white text-sm font-medium"
              target="_blank"
              rel="noreferrer"
            >
              Share to socials
            </a>
            <a
              href={shareUrl ? `sms:?&body=${encodeURIComponent(`Check this out: ${shareUrl}`)}` : "#"}
              className="px-4 py-2 rounded-md border border-border-medium bg-white text-sm font-medium"
            >
              Message contacts
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "publish" && draft) {
    const missingRequired = !draft.title.trim() || !draft.story.trim() || !location.trim();
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-5">
        <h2 className="text-2xl font-semibold text-text-primary">Preview before publish</h2>
        <div className="rounded-lg border border-border-light bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Preview</p>
          <h3 className="text-xl font-semibold text-text-primary mt-2">{draft.title}</h3>
          <p className="text-sm text-text-secondary mt-2">{draft.summary}</p>
          <p className="text-sm text-text-secondary mt-3 whitespace-pre-wrap">{draft.story}</p>
          <p className="text-sm text-text-muted mt-3">
            Goal: ${(draft.goalAmountCents / 100).toLocaleString()} · {draft.category}
          </p>
        </div>
        <div className="rounded-lg border border-border-light bg-white p-4 space-y-3">
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={shareToCommunity}
              onChange={(event) => setShareToCommunity(event.target.checked)}
            />
            Share to community
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={notifyFriends}
              onChange={(event) => setNotifyFriends(event.target.checked)}
            />
            Notify friends
          </label>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Location</label>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
        {error ? <p className="text-sm text-accent-red">{error}</p> : null}
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border-medium text-sm"
            onClick={() => setStage("review")}
          >
            Back to edit
          </button>
          <button
            type="button"
            disabled={missingRequired || isSubmitting}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-50"
            onClick={publish}
          >
            {isSubmitting ? "Publishing..." : "Publish fundraiser"}
          </button>
        </div>
      </div>
    );
  }

  if (stage === "review" && draft) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-primary">Review and edit</h2>
          <button type="button" onClick={startOverWithVoice} className="text-sm text-primary hover:underline">
            Start over with voice
          </button>
        </div>
        {draft.lowConfidence ? (
          <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
            Low confidence detected. Review and edit before publishing.
          </div>
        ) : null}
        <div className="rounded-lg border border-border-light bg-white p-4 space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted mb-1">Title</label>
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-wide text-text-muted mb-1">Summary</label>
              <button
                type="button"
                className="text-xs text-primary"
                onClick={() => setSummaryExpanded((value) => !value)}
              >
                {summaryExpanded ? "Collapse" : "Expand"}
              </button>
            </div>
            {summaryExpanded ? (
              <textarea
                value={draft.summary}
                onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
                rows={3}
                className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
              />
            ) : (
              <p className="text-sm text-text-secondary">{draft.summary}</p>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted mb-1">Story</label>
            <textarea
              value={draft.story}
              onChange={(event) => setDraft({ ...draft, story: event.target.value })}
              rows={6}
              className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted mb-1">Goal amount</label>
            <input
              type="number"
              value={Math.floor(draft.goalAmountCents / 100)}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  goalAmountCents: Math.max(1, Number(event.target.value || "0")) * 100,
                })
              }
              className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted mb-1">
              Fund breakdown
            </label>
            <textarea
              value={draft.breakdown.join("\n")}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  breakdown: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                })
              }
              rows={3}
              className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="rounded-md border border-dashed border-border-medium px-3 py-2 text-sm text-text-muted">
            Add a photo or video (optional)
          </div>
        </div>
        <div className="rounded-lg border border-border-light bg-white p-4 space-y-3">
          <p className="text-sm font-medium text-text-primary">Tone</p>
          <div className="flex gap-2">
            {TONES.map((option) => (
              <button
                key={option}
                type="button"
                className={`px-3 py-1.5 rounded-md text-sm border ${
                  tone === option ? "bg-primary text-white border-primary" : "border-border-medium"
                }`}
                onClick={() => setTone(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="text-sm text-primary" onClick={() => regenerate("title")}>
              Regenerate title
            </button>
            <button type="button" className="text-sm text-primary" onClick={() => regenerate("summary")}>
              Regenerate summary
            </button>
            <button type="button" className="text-sm text-primary" onClick={() => regenerate("story")}>
              Regenerate story
            </button>
            <button type="button" className="text-sm text-primary" onClick={() => regenerate("breakdown")}>
              Regenerate breakdown
            </button>
          </div>
        </div>
        {error ? <p className="text-sm text-accent-red">{error}</p> : null}
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border-medium text-sm"
            onClick={() => setStage("entry")}
          >
            Back
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
            onClick={() => setStage("publish")}
          >
            Continue to publish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="rounded-xl border border-border-light bg-white p-6 space-y-4">
        <h1 className="text-3xl font-semibold text-text-primary">Tell your story</h1>
        <p className="text-sm text-text-secondary">
          Tell us what happened, and what you need help with. Just talk and we&apos;ll handle the rest.
        </p>

        {stage === "recording" ? (
          <>
            <div className="rounded-lg border border-border-light p-4 bg-bg-faint">
              <p className="text-sm text-text-primary font-medium mb-1">Recording</p>
              <p className="text-xs text-text-muted mb-3">{prompt}</p>
              <div className="flex gap-1 h-6 items-end mb-2">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const active = (idx + recordingSeconds) % 5 !== 0;
                  return (
                    <span
                      key={idx}
                      className={`w-1 rounded-full ${active ? "bg-primary" : "bg-primary/25"}`}
                      style={{ height: `${((idx % 6) + 1) * 4}px` }}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-text-secondary">
                Timer: 0:{String(recordingSeconds).padStart(2, "0")}
              </p>
              {softCapReached ? (
                <p className="text-xs text-amber-700 mt-2">
                  You&apos;re past the 60s guidance mark. We&apos;ll auto-stop at 90s.
                </p>
              ) : null}
              <textarea
                value={recordingTranscript}
                onChange={(event) => setRecordingTranscript(event.target.value)}
                rows={4}
                className="mt-3 w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                placeholder="Paste or type your captured transcript while recording..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={pauseOrResume}
                className="px-4 py-2 rounded-md border border-border-medium text-sm"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={retryRecording}
                className="px-4 py-2 rounded-md border border-border-medium text-sm"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={moveToProcessing}
                className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
              >
                Stop and continue
              </button>
            </div>
          </>
        ) : (
          <>
            {typingMode ? (
              <textarea
                value={typingInput}
                onChange={(event) => setTypingInput(event.target.value)}
                rows={6}
                className="w-full border border-border-medium rounded-md px-3 py-2 text-sm"
                placeholder="Type your fundraiser story..."
              />
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={typingMode ? moveToProcessing : beginRecording}
                className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
              >
                {typingMode ? "Generate draft" : "Start recording"}
              </button>
              <button
                type="button"
                onClick={() => setTypingMode((value) => !value)}
                className="px-4 py-2 rounded-md border border-border-medium text-sm"
              >
                {typingMode ? "Use voice instead" : "Type instead"}
              </button>
            </div>
          </>
        )}

        {error ? <p className="text-sm text-accent-red">{error}</p> : null}
      </div>
    </div>
  );
}
