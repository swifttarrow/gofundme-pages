import { z } from "zod";

export const DonationCreatedPayloadSchema = z.object({
  donationId: z.string().uuid(),
  fundraiserId: z.string().uuid(),
  donorUserId: z.string().uuid().nullable(),
  amountCents: z.number().int().positive(),
  tipCents: z.number().int().nonnegative(),
  totalCents: z.number().int().positive(),
  isAnonymous: z.boolean(),
  message: z.string().max(500).nullable(),
});

export const FundraiserCreatedPayloadSchema = z.object({
  fundraiserId: z.string().uuid(),
  organizerUserId: z.string().uuid(),
});

export const FundraiserUpdatePostedPayloadSchema = z.object({
  fundraiserId: z.string().uuid(),
  updateId: z.string().uuid(),
  organizerUserId: z.string().uuid(),
  title: z.string().max(200),
  bodySnippet: z.string().max(300),
});

export const FundraiserFollowedPayloadSchema = z.object({
  fundraiserId: z.string().uuid(),
  followerUserId: z.string().uuid(),
});

export const ProfileUpdatedPayloadSchema = z.object({
  userId: z.string().uuid(),
  fields: z.array(z.enum(["name", "bio", "avatar", "location"])),
});

export const PlatformEventSchema = z.discriminatedUnion("type", [
  z.object({
    eventId: z.string().uuid(),
    type: z.literal("donation.created"),
    occurredAt: z.string().datetime(),
    payload: DonationCreatedPayloadSchema,
  }),
  z.object({
    eventId: z.string().uuid(),
    type: z.literal("fundraiser.created"),
    occurredAt: z.string().datetime(),
    payload: FundraiserCreatedPayloadSchema,
  }),
  z.object({
    eventId: z.string().uuid(),
    type: z.literal("fundraiser.update_posted"),
    occurredAt: z.string().datetime(),
    payload: FundraiserUpdatePostedPayloadSchema,
  }),
  z.object({
    eventId: z.string().uuid(),
    type: z.literal("fundraiser.followed"),
    occurredAt: z.string().datetime(),
    payload: FundraiserFollowedPayloadSchema,
  }),
  z.object({
    eventId: z.string().uuid(),
    type: z.literal("profile.updated"),
    occurredAt: z.string().datetime(),
    payload: ProfileUpdatedPayloadSchema,
  }),
]);

export type PlatformEvent = z.infer<typeof PlatformEventSchema>;
export type DonationCreatedPayload = z.infer<typeof DonationCreatedPayloadSchema>;
export type FundraiserCreatedPayload = z.infer<typeof FundraiserCreatedPayloadSchema>;
export type FundraiserUpdatePostedPayload = z.infer<typeof FundraiserUpdatePostedPayloadSchema>;
export type FundraiserFollowedPayload = z.infer<typeof FundraiserFollowedPayloadSchema>;
export type ProfileUpdatedPayload = z.infer<typeof ProfileUpdatedPayloadSchema>;

export type EventType = PlatformEvent["type"];
