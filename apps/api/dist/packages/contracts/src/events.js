"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformEventSchema = exports.ProfileUpdatedPayloadSchema = exports.FundraiserFollowedPayloadSchema = exports.FundraiserUpdatePostedPayloadSchema = exports.DonationCreatedPayloadSchema = void 0;
const zod_1 = require("zod");
exports.DonationCreatedPayloadSchema = zod_1.z.object({
    donationId: zod_1.z.string().uuid(),
    fundraiserId: zod_1.z.string().uuid(),
    donorUserId: zod_1.z.string().uuid().nullable(),
    amountCents: zod_1.z.number().int().positive(),
    tipCents: zod_1.z.number().int().nonnegative(),
    totalCents: zod_1.z.number().int().positive(),
    isAnonymous: zod_1.z.boolean(),
    message: zod_1.z.string().max(500).nullable(),
});
exports.FundraiserUpdatePostedPayloadSchema = zod_1.z.object({
    fundraiserId: zod_1.z.string().uuid(),
    updateId: zod_1.z.string().uuid(),
    organizerUserId: zod_1.z.string().uuid(),
    title: zod_1.z.string().max(200),
    bodySnippet: zod_1.z.string().max(300),
});
exports.FundraiserFollowedPayloadSchema = zod_1.z.object({
    fundraiserId: zod_1.z.string().uuid(),
    followerUserId: zod_1.z.string().uuid(),
});
exports.ProfileUpdatedPayloadSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    fields: zod_1.z.array(zod_1.z.enum(["name", "bio", "avatar", "location"])),
});
exports.PlatformEventSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        eventId: zod_1.z.string().uuid(),
        type: zod_1.z.literal("donation.created"),
        occurredAt: zod_1.z.string().datetime(),
        payload: exports.DonationCreatedPayloadSchema,
    }),
    zod_1.z.object({
        eventId: zod_1.z.string().uuid(),
        type: zod_1.z.literal("fundraiser.update_posted"),
        occurredAt: zod_1.z.string().datetime(),
        payload: exports.FundraiserUpdatePostedPayloadSchema,
    }),
    zod_1.z.object({
        eventId: zod_1.z.string().uuid(),
        type: zod_1.z.literal("fundraiser.followed"),
        occurredAt: zod_1.z.string().datetime(),
        payload: exports.FundraiserFollowedPayloadSchema,
    }),
    zod_1.z.object({
        eventId: zod_1.z.string().uuid(),
        type: zod_1.z.literal("profile.updated"),
        occurredAt: zod_1.z.string().datetime(),
        payload: exports.ProfileUpdatedPayloadSchema,
    }),
]);
