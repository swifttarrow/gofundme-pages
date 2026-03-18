import { describe, it, expect } from "vitest";
import { PlatformEventSchema } from "@gosupportme/contracts";

describe("PlatformEventSchema", () => {
  const baseEvent = {
    eventId: "123e4567-e89b-12d3-a456-426614174000",
    occurredAt: "2026-03-17T20:10:12Z",
  };

  it("accepts valid donation.created event", () => {
    const result = PlatformEventSchema.safeParse({
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
    expect(result.success).toBe(true);
  });

  it("accepts donation.created with anonymous donor (null userId)", () => {
    const result = PlatformEventSchema.safeParse({
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
    expect(result.success).toBe(true);
  });

  it("accepts fundraiser.followed event", () => {
    const result = PlatformEventSchema.safeParse({
      ...baseEvent,
      type: "fundraiser.followed",
      payload: {
        fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
        followerUserId: "123e4567-e89b-12d3-a456-426614174003",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown event type", () => {
    const result = PlatformEventSchema.safeParse({
      ...baseEvent,
      type: "payment.refunded", // not in union
      payload: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects event missing required eventId", () => {
    const result = PlatformEventSchema.safeParse({
      occurredAt: "2026-03-17T20:10:12Z",
      type: "fundraiser.followed",
      payload: {
        fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
        followerUserId: "123e4567-e89b-12d3-a456-426614174003",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects event with invalid timestamp format", () => {
    const result = PlatformEventSchema.safeParse({
      eventId: "123e4567-e89b-12d3-a456-426614174000",
      occurredAt: "not-a-date",
      type: "fundraiser.followed",
      payload: {
        fundraiserId: "123e4567-e89b-12d3-a456-426614174002",
        followerUserId: "123e4567-e89b-12d3-a456-426614174003",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate event type payload mismatch", () => {
    // donation.created with wrong payload shape
    const result = PlatformEventSchema.safeParse({
      ...baseEvent,
      type: "donation.created",
      payload: {
        // Missing required donation fields
        message: "Just a message",
      },
    });
    expect(result.success).toBe(false);
  });
});
