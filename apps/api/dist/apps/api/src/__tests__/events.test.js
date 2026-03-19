"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const contracts_1 = require("@gosupportme/contracts");
(0, vitest_1.describe)("PlatformEventSchema", () => {
    const baseEvent = {
        eventId: "123e4567-e89b-12d3-a456-426614174000",
        occurredAt: "2026-03-17T20:10:12Z",
    };
    (0, vitest_1.it)("accepts valid donation.created event", () => {
        const result = contracts_1.PlatformEventSchema.safeParse({
            ...baseEvent,
            type: "donation.created",
            payload: {
                donationId: "123e4567-e89b-12d3-a456-426614174001",
                fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
                donorUserId: "123e4567-e89b-12d3-a456-426614174003",
                amountCents: 5000,
                tipCents: 500,
                totalCents: 5500,
                isAnonymous: false,
                message: "Keep it up!",
            },
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("accepts donation.created with anonymous donor (null userId)", () => {
        const result = contracts_1.PlatformEventSchema.safeParse({
            ...baseEvent,
            type: "donation.created",
            payload: {
                donationId: "123e4567-e89b-12d3-a456-426614174001",
                fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
                donorUserId: null,
                amountCents: 5000,
                tipCents: 0,
                totalCents: 5000,
                isAnonymous: true,
                message: null,
            },
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("accepts fundraiser.followed event", () => {
        const result = contracts_1.PlatformEventSchema.safeParse({
            ...baseEvent,
            type: "fundraiser.followed",
            payload: {
                fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
                followerUserId: "123e4567-e89b-12d3-a456-426614174003",
            },
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("rejects unknown event type", () => {
        const result = contracts_1.PlatformEventSchema.safeParse({
            ...baseEvent,
            type: "payment.refunded", // not in union
            payload: {},
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("rejects event missing required eventId", () => {
        const result = contracts_1.PlatformEventSchema.safeParse({
            occurredAt: "2026-03-17T20:10:12Z",
            type: "fundraiser.followed",
            payload: {
                fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
                followerUserId: "123e4567-e89b-12d3-a456-426614174003",
            },
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("rejects event with invalid timestamp format", () => {
        const result = contracts_1.PlatformEventSchema.safeParse({
            eventId: "123e4567-e89b-12d3-a456-426614174000",
            occurredAt: "not-a-date",
            type: "fundraiser.followed",
            payload: {
                fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
                followerUserId: "123e4567-e89b-12d3-a456-426614174003",
            },
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("rejects duplicate event type payload mismatch", () => {
        // donation.created with wrong payload shape
        const result = contracts_1.PlatformEventSchema.safeParse({
            ...baseEvent,
            type: "donation.created",
            payload: {
                // Missing required donation fields
                message: "Just a message",
            },
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
});
