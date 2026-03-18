import { z } from "zod";

export const VoiceToneSchema = z.enum(["emotional", "direct", "detailed"]);
export type VoiceTone = z.infer<typeof VoiceToneSchema>;

export const DraftSectionSchema = z.enum(["title", "summary", "story", "breakdown"]);
export type DraftSection = z.infer<typeof DraftSectionSchema>;

export type VoiceDraft = {
  title: string;
  summary: string;
  story: string;
  goalAmountCents: number;
  category: string;
  breakdown: string[];
  entities: {
    person: string | null;
    cause: string | null;
    urgency: string | null;
    amountHintCents: number | null;
  };
  confidence: number;
  lowConfidence: boolean;
};

const FILLER_WORDS = new Set([
  "um",
  "uh",
  "like",
  "you know",
  "kind of",
  "sort of",
  "basically",
  "literally",
]);

const BLOCKED_TERMS = ["hate", "violence", "terror", "scam", "fraud"];

const CATEGORY_KEYWORDS: Array<{ category: string; words: string[] }> = [
  { category: "Medical", words: ["hospital", "surgery", "medical", "treatment"] },
  { category: "Emergency", words: ["fire", "flood", "emergency", "evacuated"] },
  { category: "Community", words: ["community", "neighbors", "local", "school"] },
  { category: "Education", words: ["tuition", "college", "education", "student"] },
];

export function normalizeTranscript(raw: string): string {
  const compact = raw.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  const withoutPhraseFillers = compact
    .replace(/\byou know\b/gi, " ")
    .replace(/\bkind of\b/gi, " ")
    .replace(/\bsort of\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const parts = withoutPhraseFillers.split(/\s+/);
  const filtered = parts.filter((word, idx) => {
    const lower = word.toLowerCase().replace(/[.,!?]/g, "");
    if (FILLER_WORDS.has(lower)) return false;
    if (idx > 0 && lower === parts[idx - 1].toLowerCase().replace(/[.,!?]/g, "")) {
      return false;
    }
    return true;
  });
  return filtered.join(" ").trim();
}

export function runModerationChecks(transcript: string): { safe: boolean; reason: string | null } {
  const lower = transcript.toLowerCase();
  const hit = BLOCKED_TERMS.find((term) => lower.includes(term));
  if (hit) {
    return {
      safe: false,
      reason:
        "We could not process that request safely. Please remove harmful language and try again.",
    };
  }
  return { safe: true, reason: null };
}

function pickCategory(normalizedTranscript: string): string {
  const lower = normalizedTranscript.toLowerCase();
  const match = CATEGORY_KEYWORDS.find((item) =>
    item.words.some((word) => lower.includes(word))
  );
  return match?.category ?? "General";
}

function extractAmountHintCents(transcript: string): number | null {
  const match = transcript.match(/\$?(\d{2,6})(?:\s?(?:usd|dollars?))?/i);
  if (!match?.[1]) return null;
  return Number(match[1]) * 100;
}

function clampSummary(words: string[], maxWords: number): string {
  return words.slice(0, maxWords).join(" ");
}

function titleFromTranscript(normalizedTranscript: string): string {
  const base = normalizedTranscript.split(/[.!?]/)[0]?.trim() ?? "Support our fundraiser";
  if (!base) return "Support our fundraiser";
  const titled = base.charAt(0).toUpperCase() + base.slice(1);
  return titled.slice(0, 80);
}

function estimateConfidence(normalizedTranscript: string): number {
  const words = normalizedTranscript.split(/\s+/).filter(Boolean);
  const hasEnoughWords = words.length >= 12;
  const hasAmountHint = extractAmountHintCents(normalizedTranscript) !== null;
  const score = (hasEnoughWords ? 0.55 : 0.35) + (hasAmountHint ? 0.25 : 0.1) + 0.2;
  return Math.max(0, Math.min(0.99, Number(score.toFixed(2))));
}

export function runGroundingChecks(
  transcript: string,
  draft: Pick<VoiceDraft, "title" | "summary" | "story">
): { grounded: boolean; missingEvidence: string[] } {
  const tokens = new Set(
    transcript
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3)
  );
  const generated = `${draft.title} ${draft.summary} ${draft.story}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 6);

  const unknown = Array.from(new Set(generated.filter((token) => !tokens.has(token))));
  const missingEvidence = unknown.slice(0, 4);
  return {
    grounded: missingEvidence.length <= 2,
    missingEvidence,
  };
}

export function generateDraftFromTranscript(normalizedTranscript: string): VoiceDraft {
  const words = normalizedTranscript.split(/\s+/).filter(Boolean);
  const title = titleFromTranscript(normalizedTranscript);
  const summary = clampSummary(words, 120);
  const story = normalizedTranscript;
  const amountHint = extractAmountHintCents(normalizedTranscript);
  const goalAmountCents = amountHint ?? 250000;
  const category = pickCategory(normalizedTranscript);
  const confidence = estimateConfidence(normalizedTranscript);

  const cause =
    CATEGORY_KEYWORDS.find((item) => item.category === category)?.words.find((word) =>
      normalizedTranscript.toLowerCase().includes(word)
    ) ?? null;

  return {
    title,
    summary,
    story,
    goalAmountCents,
    category,
    breakdown: [
      "Immediate support for urgent needs",
      "Short-term recovery costs",
      "Long-term stabilization and follow-up",
    ],
    entities: {
      person: null,
      cause,
      urgency: normalizedTranscript.toLowerCase().includes("urgent") ? "urgent" : null,
      amountHintCents: amountHint,
    },
    confidence,
    lowConfidence: confidence < 0.55,
  };
}

export function regenerateSection(params: {
  section: DraftSection;
  tone: VoiceTone;
  currentDraft: VoiceDraft;
  normalizedTranscript: string;
}): VoiceDraft {
  const { section, tone, currentDraft, normalizedTranscript } = params;
  const draft = { ...currentDraft, breakdown: [...currentDraft.breakdown] };
  const tonePrefix =
    tone === "emotional"
      ? "With heart: "
      : tone === "detailed"
      ? "In detail: "
      : "Clearly: ";

  if (section === "title") {
    draft.title = `${tonePrefix}${titleFromTranscript(normalizedTranscript)}`.slice(0, 80);
  } else if (section === "summary") {
    const base = clampSummary(normalizedTranscript.split(/\s+/).filter(Boolean), 120);
    draft.summary = `${tonePrefix}${base}`.trim();
  } else if (section === "story") {
    draft.story = `${tonePrefix}${normalizedTranscript}`.trim();
  } else {
    draft.breakdown = [
      tone === "direct" ? "Core essentials first" : "Immediate support for urgent needs",
      tone === "detailed" ? "Category-by-category fund usage with clear targets" : "Recovery and follow-up support",
      "Transparent updates for donors",
    ];
  }

  return draft;
}
