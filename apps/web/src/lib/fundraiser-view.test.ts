import { describe, expect, it } from "vitest";
import { DEFAULT_FUNDRAISER_IMAGE, toSeedFundraiser } from "./fundraiser-view";

describe("toSeedFundraiser", () => {
  it("computes progress and fills defaults for card views", () => {
    const fundraiser = toSeedFundraiser({
      id: "fundraiser-1",
      title: "Support wildfire recovery",
      goalCents: 10000,
      raisedCents: 5500,
      category: "Emergency",
      donorCount: 12,
    });

    expect(fundraiser.coverImageUrl).toBe(DEFAULT_FUNDRAISER_IMAGE);
    expect(fundraiser.progressPercent).toBe(55);
    expect(fundraiser.organizerName).toBe("GoSupportMe organizer");
    expect(fundraiser.followerCount).toBe(0);
  });

  it("preserves provided fundraiser metadata", () => {
    const fundraiser = toSeedFundraiser({
      id: "fundraiser-2",
      organizerId: "user-1",
      organizerName: "Sarah Johnson",
      organizerAvatar: "https://example.com/avatar.png",
      title: "Fund school supplies",
      story: "Detailed campaign story",
      coverImageUrl: "https://example.com/cover.png",
      goalCents: 20000,
      raisedCents: 12000,
      category: "Education",
      location: "Oakland, CA",
      isUrgent: true,
      donorCount: 34,
      followerCount: 8,
      createdAt: "2026-03-19T00:00:00Z",
      progressPercent: 60,
    });

    expect(fundraiser.organizerId).toBe("user-1");
    expect(fundraiser.organizerName).toBe("Sarah Johnson");
    expect(fundraiser.coverImageUrl).toBe("https://example.com/cover.png");
    expect(fundraiser.progressPercent).toBe(60);
    expect(fundraiser.location).toBe("Oakland, CA");
    expect(fundraiser.isUrgent).toBe(true);
  });
});
