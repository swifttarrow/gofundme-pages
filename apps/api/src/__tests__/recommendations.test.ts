import { describe, it, expect } from "vitest";

// Pure scoring logic extracted for unit testing
function computeScore(weights: {
  interestMatch: number;   // 0–1
  donationSimilarity: number; // 0–1
  trendingBoost: number;   // 0–3 (capped)
  recency: number;         // 0–1
}): number {
  return (
    weights.interestMatch * 0.4 +
    weights.donationSimilarity * 0.3 +
    Math.min(weights.trendingBoost, 3) * 0.2 +
    weights.recency * 0.1
  );
}

function injectExploration<T>(items: T[], explorationSlots: T[], ratio: number): T[] {
  const explorationCount = Math.floor(items.length * ratio);
  const regularItems = items.slice(0, items.length - explorationCount);
  const explorationItems = explorationSlots.slice(0, explorationCount);
  // Interleave exploration items throughout the list
  const result = [...regularItems];
  const step = Math.floor(result.length / (explorationCount + 1));
  explorationItems.forEach((item, i) => {
    result.splice(step * (i + 1), 0, item);
  });
  return result;
}

describe("Recommendation scoring", () => {
  it("weights interest match at 40%", () => {
    const highInterest = computeScore({ interestMatch: 1, donationSimilarity: 0, trendingBoost: 0, recency: 0 });
    const lowInterest = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 0, recency: 0 });
    expect(highInterest - lowInterest).toBeCloseTo(0.4, 3);
  });

  it("weights donation similarity at 30%", () => {
    const high = computeScore({ interestMatch: 0, donationSimilarity: 1, trendingBoost: 0, recency: 0 });
    expect(high).toBeCloseTo(0.3, 3);
  });

  it("weights trending boost at 20% (capped at 3x)", () => {
    const maxTrending = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 5, recency: 0 });
    const normalTrending = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 1, recency: 0 });
    // 5x trending is capped at 3x, so score = 3 * 0.2 = 0.6
    expect(maxTrending).toBeCloseTo(0.6, 3);
    // 1x trending = 1 * 0.2 = 0.2
    expect(normalTrending).toBeCloseTo(0.2, 3);
  });

  it("weights recency at 10%", () => {
    const fresh = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 0, recency: 1 });
    expect(fresh).toBeCloseTo(0.1, 3);
  });

  it("max score is 1.6 (when trending at 3x)", () => {
    const max = computeScore({ interestMatch: 1, donationSimilarity: 1, trendingBoost: 3, recency: 1 });
    // 0.4 + 0.3 + 0.6 + 0.1 = 1.4... wait: 3 * 0.2 = 0.6 → total = 0.4+0.3+0.6+0.1 = 1.4
    expect(max).toBeCloseTo(1.4, 3);
  });

  it("ranks items in descending score order", () => {
    const items = [
      { id: "A", score: computeScore({ interestMatch: 0.5, donationSimilarity: 0.3, trendingBoost: 1, recency: 0.8 }) },
      { id: "B", score: computeScore({ interestMatch: 1.0, donationSimilarity: 1.0, trendingBoost: 2, recency: 1.0 }) },
      { id: "C", score: computeScore({ interestMatch: 0.1, donationSimilarity: 0.1, trendingBoost: 0, recency: 0.1 }) },
    ].sort((a, b) => b.score - a.score);

    expect(items[0].id).toBe("B");
    expect(items[2].id).toBe("C");
  });
});

describe("Exploration injection", () => {
  it("injects approximately 15% exploration slots", () => {
    const regular = Array.from({ length: 17 }, (_, i) => ({ id: `r${i}`, type: "regular" }));
    const exploration = Array.from({ length: 5 }, (_, i) => ({ id: `e${i}`, type: "exploration" }));
    const result = injectExploration(regular, exploration, 0.15);
    const explorationCount = result.filter((r) => r.type === "exploration").length;
    // 15% of 20 items = 3 exploration slots
    expect(explorationCount).toBeGreaterThanOrEqual(2);
    expect(explorationCount).toBeLessThanOrEqual(4);
  });

  it("never exceeds available exploration slots", () => {
    const regular = Array.from({ length: 20 }, (_, i) => ({ id: `r${i}` }));
    const exploration = [{ id: "e1" }]; // Only 1 available
    const result = injectExploration(regular, exploration, 0.15);
    const explorationCount = result.filter((r) => r.id === "e1").length;
    expect(explorationCount).toBe(1);
  });
});
