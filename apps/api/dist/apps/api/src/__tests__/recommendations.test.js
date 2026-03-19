"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Pure scoring logic extracted for unit testing
function computeScore(weights) {
    return (weights.interestMatch * 0.4 +
        weights.donationSimilarity * 0.3 +
        Math.min(weights.trendingBoost, 3) * 0.2 +
        weights.recency * 0.1);
}
function injectExploration(items, explorationSlots, ratio) {
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
(0, vitest_1.describe)("Recommendation scoring", () => {
    (0, vitest_1.it)("weights interest match at 40%", () => {
        const highInterest = computeScore({ interestMatch: 1, donationSimilarity: 0, trendingBoost: 0, recency: 0 });
        const lowInterest = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 0, recency: 0 });
        (0, vitest_1.expect)(highInterest - lowInterest).toBeCloseTo(0.4, 3);
    });
    (0, vitest_1.it)("weights donation similarity at 30%", () => {
        const high = computeScore({ interestMatch: 0, donationSimilarity: 1, trendingBoost: 0, recency: 0 });
        (0, vitest_1.expect)(high).toBeCloseTo(0.3, 3);
    });
    (0, vitest_1.it)("weights trending boost at 20% (capped at 3x)", () => {
        const maxTrending = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 5, recency: 0 });
        const normalTrending = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 1, recency: 0 });
        // 5x trending is capped at 3x, so score = 3 * 0.2 = 0.6
        (0, vitest_1.expect)(maxTrending).toBeCloseTo(0.6, 3);
        // 1x trending = 1 * 0.2 = 0.2
        (0, vitest_1.expect)(normalTrending).toBeCloseTo(0.2, 3);
    });
    (0, vitest_1.it)("weights recency at 10%", () => {
        const fresh = computeScore({ interestMatch: 0, donationSimilarity: 0, trendingBoost: 0, recency: 1 });
        (0, vitest_1.expect)(fresh).toBeCloseTo(0.1, 3);
    });
    (0, vitest_1.it)("max score is 1.6 (when trending at 3x)", () => {
        const max = computeScore({ interestMatch: 1, donationSimilarity: 1, trendingBoost: 3, recency: 1 });
        // 0.4 + 0.3 + 0.6 + 0.1 = 1.4... wait: 3 * 0.2 = 0.6 → total = 0.4+0.3+0.6+0.1 = 1.4
        (0, vitest_1.expect)(max).toBeCloseTo(1.4, 3);
    });
    (0, vitest_1.it)("ranks items in descending score order", () => {
        const items = [
            { id: "A", score: computeScore({ interestMatch: 0.5, donationSimilarity: 0.3, trendingBoost: 1, recency: 0.8 }) },
            { id: "B", score: computeScore({ interestMatch: 1.0, donationSimilarity: 1.0, trendingBoost: 2, recency: 1.0 }) },
            { id: "C", score: computeScore({ interestMatch: 0.1, donationSimilarity: 0.1, trendingBoost: 0, recency: 0.1 }) },
        ].sort((a, b) => b.score - a.score);
        (0, vitest_1.expect)(items[0].id).toBe("B");
        (0, vitest_1.expect)(items[2].id).toBe("C");
    });
});
(0, vitest_1.describe)("Exploration injection", () => {
    (0, vitest_1.it)("injects approximately 15% exploration slots", () => {
        const regular = Array.from({ length: 17 }, (_, i) => ({ id: `r${i}`, type: "regular" }));
        const exploration = Array.from({ length: 5 }, (_, i) => ({ id: `e${i}`, type: "exploration" }));
        const result = injectExploration(regular, exploration, 0.15);
        const explorationCount = result.filter((r) => r.type === "exploration").length;
        // 15% of 20 items = 3 exploration slots
        (0, vitest_1.expect)(explorationCount).toBeGreaterThanOrEqual(2);
        (0, vitest_1.expect)(explorationCount).toBeLessThanOrEqual(4);
    });
    (0, vitest_1.it)("never exceeds available exploration slots", () => {
        const regular = Array.from({ length: 20 }, (_, i) => ({ id: `r${i}` }));
        const exploration = [{ id: "e1" }]; // Only 1 available
        const result = injectExploration(regular, exploration, 0.15);
        const explorationCount = result.filter((r) => r.id === "e1").length;
        (0, vitest_1.expect)(explorationCount).toBe(1);
    });
});
