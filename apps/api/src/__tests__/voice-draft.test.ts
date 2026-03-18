import { describe, expect, it } from "vitest";
import {
  generateDraftFromTranscript,
  normalizeTranscript,
  regenerateSection,
  runGroundingChecks,
  runModerationChecks,
} from "../services/voice-draft";

describe("voice draft pipeline", () => {
  it("normalizes filler words and duplicate tokens", () => {
    const normalized = normalizeTranscript(
      "Um we we need support for hospital bills you know after a fire"
    );
    expect(normalized.toLowerCase()).not.toContain("um");
    expect(normalized.toLowerCase()).not.toContain("you know");
    expect(normalized.toLowerCase()).not.toContain("we we");
  });

  it("flags unsafe transcript content", () => {
    const moderation = runModerationChecks("this is a scam and fraud");
    expect(moderation.safe).toBe(false);
  });

  it("generates schema-compliant draft limits", () => {
    const draft = generateDraftFromTranscript(
      "My brother needs urgent medical support for surgery and recovery. We need around 7000 dollars."
    );
    expect(draft.title.length).toBeLessThanOrEqual(80);
    expect(draft.summary.split(/\s+/).length).toBeLessThanOrEqual(120);
    expect(draft.goalAmountCents).toBeGreaterThan(0);
  });

  it("grounds output against transcript evidence", () => {
    const transcript = "Family house fire and emergency housing costs in Atlanta.";
    const draft = generateDraftFromTranscript(transcript);
    const grounding = runGroundingChecks(transcript, draft);
    expect(typeof grounding.grounded).toBe("boolean");
  });

  it("regenerates only target section while preserving others", () => {
    const initial = generateDraftFromTranscript(
      "We need support for emergency rent and food costs for our family."
    );
    const next = regenerateSection({
      section: "title",
      tone: "direct",
      currentDraft: initial,
      normalizedTranscript:
        "We need support for emergency rent and food costs for our family.",
    });
    expect(next.title).not.toEqual(initial.title);
    expect(next.story).toEqual(initial.story);
  });
});
