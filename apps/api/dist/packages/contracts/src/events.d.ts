import { z } from "zod";
export declare const DonationCreatedPayloadSchema: z.ZodObject<{
    donationId: z.ZodString;
    fundraiserId: z.ZodString;
    donorUserId: z.ZodNullable<z.ZodString>;
    amountCents: z.ZodNumber;
    tipCents: z.ZodNumber;
    totalCents: z.ZodNumber;
    isAnonymous: z.ZodBoolean;
    message: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    donationId: string;
    fundraiserId: string;
    donorUserId: string | null;
    amountCents: number;
    tipCents: number;
    totalCents: number;
    isAnonymous: boolean;
    message: string | null;
}, {
    donationId: string;
    fundraiserId: string;
    donorUserId: string | null;
    amountCents: number;
    tipCents: number;
    totalCents: number;
    isAnonymous: boolean;
    message: string | null;
}>;
export declare const FundraiserUpdatePostedPayloadSchema: z.ZodObject<{
    fundraiserId: z.ZodString;
    updateId: z.ZodString;
    organizerUserId: z.ZodString;
    title: z.ZodString;
    bodySnippet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fundraiserId: string;
    updateId: string;
    organizerUserId: string;
    title: string;
    bodySnippet: string;
}, {
    fundraiserId: string;
    updateId: string;
    organizerUserId: string;
    title: string;
    bodySnippet: string;
}>;
export declare const FundraiserFollowedPayloadSchema: z.ZodObject<{
    fundraiserId: z.ZodString;
    followerUserId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fundraiserId: string;
    followerUserId: string;
}, {
    fundraiserId: string;
    followerUserId: string;
}>;
export declare const ProfileUpdatedPayloadSchema: z.ZodObject<{
    userId: z.ZodString;
    fields: z.ZodArray<z.ZodEnum<["name", "bio", "avatar", "location"]>, "many">;
}, "strip", z.ZodTypeAny, {
    userId: string;
    fields: ("name" | "bio" | "avatar" | "location")[];
}, {
    userId: string;
    fields: ("name" | "bio" | "avatar" | "location")[];
}>;
export declare const PlatformEventSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    eventId: z.ZodString;
    type: z.ZodLiteral<"donation.created">;
    occurredAt: z.ZodString;
    payload: z.ZodObject<{
        donationId: z.ZodString;
        fundraiserId: z.ZodString;
        donorUserId: z.ZodNullable<z.ZodString>;
        amountCents: z.ZodNumber;
        tipCents: z.ZodNumber;
        totalCents: z.ZodNumber;
        isAnonymous: z.ZodBoolean;
        message: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        donationId: string;
        fundraiserId: string;
        donorUserId: string | null;
        amountCents: number;
        tipCents: number;
        totalCents: number;
        isAnonymous: boolean;
        message: string | null;
    }, {
        donationId: string;
        fundraiserId: string;
        donorUserId: string | null;
        amountCents: number;
        tipCents: number;
        totalCents: number;
        isAnonymous: boolean;
        message: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "donation.created";
    eventId: string;
    occurredAt: string;
    payload: {
        donationId: string;
        fundraiserId: string;
        donorUserId: string | null;
        amountCents: number;
        tipCents: number;
        totalCents: number;
        isAnonymous: boolean;
        message: string | null;
    };
}, {
    type: "donation.created";
    eventId: string;
    occurredAt: string;
    payload: {
        donationId: string;
        fundraiserId: string;
        donorUserId: string | null;
        amountCents: number;
        tipCents: number;
        totalCents: number;
        isAnonymous: boolean;
        message: string | null;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    type: z.ZodLiteral<"fundraiser.update_posted">;
    occurredAt: z.ZodString;
    payload: z.ZodObject<{
        fundraiserId: z.ZodString;
        updateId: z.ZodString;
        organizerUserId: z.ZodString;
        title: z.ZodString;
        bodySnippet: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fundraiserId: string;
        updateId: string;
        organizerUserId: string;
        title: string;
        bodySnippet: string;
    }, {
        fundraiserId: string;
        updateId: string;
        organizerUserId: string;
        title: string;
        bodySnippet: string;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "fundraiser.update_posted";
    eventId: string;
    occurredAt: string;
    payload: {
        fundraiserId: string;
        updateId: string;
        organizerUserId: string;
        title: string;
        bodySnippet: string;
    };
}, {
    type: "fundraiser.update_posted";
    eventId: string;
    occurredAt: string;
    payload: {
        fundraiserId: string;
        updateId: string;
        organizerUserId: string;
        title: string;
        bodySnippet: string;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    type: z.ZodLiteral<"fundraiser.followed">;
    occurredAt: z.ZodString;
    payload: z.ZodObject<{
        fundraiserId: z.ZodString;
        followerUserId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fundraiserId: string;
        followerUserId: string;
    }, {
        fundraiserId: string;
        followerUserId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "fundraiser.followed";
    eventId: string;
    occurredAt: string;
    payload: {
        fundraiserId: string;
        followerUserId: string;
    };
}, {
    type: "fundraiser.followed";
    eventId: string;
    occurredAt: string;
    payload: {
        fundraiserId: string;
        followerUserId: string;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    type: z.ZodLiteral<"profile.updated">;
    occurredAt: z.ZodString;
    payload: z.ZodObject<{
        userId: z.ZodString;
        fields: z.ZodArray<z.ZodEnum<["name", "bio", "avatar", "location"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        fields: ("name" | "bio" | "avatar" | "location")[];
    }, {
        userId: string;
        fields: ("name" | "bio" | "avatar" | "location")[];
    }>;
}, "strip", z.ZodTypeAny, {
    type: "profile.updated";
    eventId: string;
    occurredAt: string;
    payload: {
        userId: string;
        fields: ("name" | "bio" | "avatar" | "location")[];
    };
}, {
    type: "profile.updated";
    eventId: string;
    occurredAt: string;
    payload: {
        userId: string;
        fields: ("name" | "bio" | "avatar" | "location")[];
    };
}>]>;
export type PlatformEvent = z.infer<typeof PlatformEventSchema>;
export type DonationCreatedPayload = z.infer<typeof DonationCreatedPayloadSchema>;
export type FundraiserUpdatePostedPayload = z.infer<typeof FundraiserUpdatePostedPayloadSchema>;
export type FundraiserFollowedPayload = z.infer<typeof FundraiserFollowedPayloadSchema>;
export type ProfileUpdatedPayload = z.infer<typeof ProfileUpdatedPayloadSchema>;
export type EventType = PlatformEvent["type"];
