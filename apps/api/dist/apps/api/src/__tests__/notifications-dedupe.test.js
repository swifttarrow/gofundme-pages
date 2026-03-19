"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Dedupe key generation logic (pure function, no DB)
function generateDedupeKey(params) {
    return `${params.userId}:${params.eventType}:${params.fundraiserId}:${params.windowHour}`;
}
function getWindowHour(timestamp) {
    return Math.floor(timestamp.getTime() / (1000 * 60 * 60));
}
(0, vitest_1.describe)("Notification deduplication", () => {
    const userId = "usr_123";
    const fundraiserId = "fr_456";
    (0, vitest_1.it)("generates same key for same event in same hour", () => {
        const t1 = new Date("2026-03-17T20:10:00Z");
        const t2 = new Date("2026-03-17T20:50:00Z");
        const key1 = generateDedupeKey({
            userId,
            eventType: "donation.created",
            fundraiserId,
            windowHour: getWindowHour(t1),
        });
        const key2 = generateDedupeKey({
            userId,
            eventType: "donation.created",
            fundraiserId,
            windowHour: getWindowHour(t2),
        });
        (0, vitest_1.expect)(key1).toBe(key2); // Same hour window
    });
    (0, vitest_1.it)("generates different key for different hours (no cross-window bundling)", () => {
        const t1 = new Date("2026-03-17T20:59:59Z"); // hour 20
        const t2 = new Date("2026-03-17T21:00:01Z"); // hour 21
        const key1 = generateDedupeKey({
            userId,
            eventType: "donation.created",
            fundraiserId,
            windowHour: getWindowHour(t1),
        });
        const key2 = generateDedupeKey({
            userId,
            eventType: "donation.created",
            fundraiserId,
            windowHour: getWindowHour(t2),
        });
        (0, vitest_1.expect)(key1).not.toBe(key2); // Different hour windows
    });
    (0, vitest_1.it)("generates different key for different users", () => {
        const hour = getWindowHour(new Date("2026-03-17T20:00:00Z"));
        const key1 = generateDedupeKey({ userId: "usr_123", eventType: "donation.created", fundraiserId, windowHour: hour });
        const key2 = generateDedupeKey({ userId: "usr_456", eventType: "donation.created", fundraiserId, windowHour: hour });
        (0, vitest_1.expect)(key1).not.toBe(key2);
    });
    (0, vitest_1.it)("generates different key for different event types", () => {
        const hour = getWindowHour(new Date("2026-03-17T20:00:00Z"));
        const key1 = generateDedupeKey({ userId, eventType: "donation.created", fundraiserId, windowHour: hour });
        const key2 = generateDedupeKey({ userId, eventType: "fundraiser.update_posted", fundraiserId, windowHour: hour });
        (0, vitest_1.expect)(key1).not.toBe(key2);
    });
    (0, vitest_1.it)("generates different key for different fundraisers", () => {
        const hour = getWindowHour(new Date("2026-03-17T20:00:00Z"));
        const key1 = generateDedupeKey({ userId, eventType: "donation.created", fundraiserId: "fr_111", windowHour: hour });
        const key2 = generateDedupeKey({ userId, eventType: "donation.created", fundraiserId: "fr_222", windowHour: hour });
        (0, vitest_1.expect)(key1).not.toBe(key2);
    });
    (0, vitest_1.it)("simulates deduplication preventing duplicate notifications", () => {
        const seenKeys = new Set();
        const notifications = [];
        const hour = getWindowHour(new Date("2026-03-17T20:00:00Z"));
        const events = [
            { userId, eventType: "donation.created", fundraiserId },
            { userId, eventType: "donation.created", fundraiserId }, // duplicate
            { userId, eventType: "donation.created", fundraiserId }, // duplicate
            { userId: "usr_456", eventType: "donation.created", fundraiserId }, // different user
        ];
        for (const event of events) {
            const key = generateDedupeKey({ ...event, windowHour: hour });
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                notifications.push(key);
            }
        }
        (0, vitest_1.expect)(notifications).toHaveLength(2); // usr_123 + usr_456, no duplicates
    });
});
(0, vitest_1.describe)("Bundling threshold logic", () => {
    (0, vitest_1.it)("triggers bundle when 3+ events in same window", () => {
        const BUNDLE_THRESHOLD = 3;
        const countsPerKey = {};
        function processEvent(dedupeKey) {
            countsPerKey[dedupeKey] = (countsPerKey[dedupeKey] ?? 0) + 1;
            if (countsPerKey[dedupeKey] === 1)
                return "single";
            if (countsPerKey[dedupeKey] === BUNDLE_THRESHOLD)
                return "bundled";
            return "skip";
        }
        const key = "usr_123:donation.created:fr_456:100";
        (0, vitest_1.expect)(processEvent(key)).toBe("single"); // 1st event
        (0, vitest_1.expect)(processEvent(key)).toBe("skip"); // 2nd event
        (0, vitest_1.expect)(processEvent(key)).toBe("bundled"); // 3rd event — bundle!
        (0, vitest_1.expect)(processEvent(key)).toBe("skip"); // 4th event — already bundled
    });
});
