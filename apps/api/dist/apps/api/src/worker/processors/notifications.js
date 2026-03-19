"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNotification = processNotification;
const client_1 = require("../../db/client");
const redis_1 = require("../../db/redis");
const metrics_1 = require("../../observability/metrics");
const DEDUPE_TTL_SECONDS = 72 * 60 * 60; // 72 hours
const BUNDLE_THRESHOLD = 3;
async function processNotification(job) {
    const { event } = job.data;
    switch (event.type) {
        case "donation.created":
            await handleDonationCreated(event);
            break;
        case "fundraiser.update_posted":
            await handleFundraiserUpdate(event);
            break;
        case "fundraiser.followed":
            await handleFundraiserFollowed(event);
            break;
        default:
            // No notification for other event types
            break;
    }
}
async function handleDonationCreated(event) {
    const { fundraiserId, donorUserId, amountCents, isAnonymous } = event.payload;
    // Notify the fundraiser organizer
    const frResult = await client_1.db.query("SELECT organizer_id, title FROM fundraisers WHERE id = $1", [fundraiserId]);
    if (frResult.rowCount === 0)
        return;
    const { organizer_id, title } = frResult.rows[0];
    const amountFormatted = `$${(amountCents / 100).toFixed(2)}`;
    const dedupeKey = `donation-received-${fundraiserId}-${event.eventId}`;
    const alreadyNotified = await checkDedupeAndMark(organizer_id, dedupeKey);
    if (alreadyNotified)
        return;
    await insertNotification({
        userId: organizer_id,
        type: "donation_received",
        title: `New donation of ${amountFormatted} to "${title}"`,
        body: isAnonymous
            ? "An anonymous donor just contributed to your fundraiser."
            : `A donor contributed to your fundraiser.`,
        reasonText: "You are the organizer of this fundraiser",
        deepLink: `/fundraiser/${fundraiserId}`,
        sourceEventId: event.eventId,
        dedupeKey,
    });
    // Also notify followers
    const followers = await client_1.db.query("SELECT follower_id FROM follows WHERE fundraiser_id = $1", [fundraiserId]);
    for (const row of followers.rows) {
        if (row.follower_id === donorUserId)
            continue; // Don't notify self
        const followerDedupeKey = `follower-donation-${fundraiserId}-${row.follower_id}-${windowKey()}`;
        const bundleCount = await getBundleCount(followerDedupeKey);
        if (bundleCount >= BUNDLE_THRESHOLD) {
            // Update existing bundled notification
            await client_1.db.query(`UPDATE notifications
         SET bundle_count = bundle_count + 1, is_bundled = TRUE, title = $1
         WHERE user_id = $2 AND dedupe_key = $3`, [
                `${bundleCount + 1} new donations to "${title}"`,
                row.follower_id,
                followerDedupeKey,
            ]);
        }
        else {
            const alreadyNotifiedFollower = await checkDedupeAndMark(row.follower_id, followerDedupeKey);
            if (!alreadyNotifiedFollower) {
                await insertNotification({
                    userId: row.follower_id,
                    type: "donation_received",
                    title: `${amountFormatted} donated to "${title}"`,
                    body: "A fundraiser you follow just received a donation.",
                    reasonText: "Because you follow this fundraiser",
                    deepLink: `/fundraiser/${fundraiserId}`,
                    sourceEventId: event.eventId,
                    dedupeKey: followerDedupeKey,
                });
            }
        }
    }
}
async function handleFundraiserUpdate(event) {
    const { fundraiserId, title, bodySnippet } = event.payload;
    const followers = await client_1.db.query("SELECT follower_id FROM follows WHERE fundraiser_id = $1", [fundraiserId]);
    for (const row of followers.rows) {
        const dedupeKey = `fr-update-${event.payload.updateId}-${row.follower_id}`;
        const alreadyNotified = await checkDedupeAndMark(row.follower_id, dedupeKey);
        if (alreadyNotified)
            continue;
        await insertNotification({
            userId: row.follower_id,
            type: "fundraiser_update",
            title,
            body: bodySnippet,
            reasonText: "Because you follow this fundraiser",
            deepLink: `/fundraiser/${fundraiserId}`,
            sourceEventId: event.eventId,
            dedupeKey,
        });
    }
}
async function handleFundraiserFollowed(event) {
    const { fundraiserId, followerUserId } = event.payload;
    const frResult = await client_1.db.query("SELECT organizer_id, title FROM fundraisers WHERE id = $1", [fundraiserId]);
    if (frResult.rowCount === 0)
        return;
    const { organizer_id, title } = frResult.rows[0];
    if (organizer_id === followerUserId)
        return;
    const followerResult = await client_1.db.query("SELECT name FROM users WHERE id = $1", [followerUserId]);
    const followerName = followerResult.rows[0]?.name ?? "Someone";
    const dedupeKey = `follow-${fundraiserId}-${followerUserId}`;
    const alreadyNotified = await checkDedupeAndMark(organizer_id, dedupeKey);
    if (alreadyNotified)
        return;
    await insertNotification({
        userId: organizer_id,
        type: "follow_activity",
        title: `${followerName} is now following "${title}"`,
        body: "Your fundraiser is growing!",
        reasonText: "You are the organizer of this fundraiser",
        deepLink: `/fundraiser/${fundraiserId}`,
        sourceEventId: event.eventId,
        dedupeKey,
    });
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
async function checkDedupeAndMark(userId, dedupeKey) {
    const redisKey = `notif-dedupe:${userId}:${dedupeKey}`;
    const result = await redis_1.redis.set(redisKey, "1", "EX", DEDUPE_TTL_SECONDS, "NX");
    return result === null; // null means key existed (NX failed)
}
async function getBundleCount(dedupeKey) {
    const result = await client_1.db.query("SELECT bundle_count FROM notifications WHERE dedupe_key = $1 LIMIT 1", [dedupeKey]);
    return result.rows[0]?.bundle_count ?? 0;
}
function windowKey() {
    // 4-hour window key for bundling
    const now = new Date();
    const windowHours = Math.floor(now.getHours() / 4) * 4;
    return `${now.toISOString().slice(0, 10)}-${windowHours}`;
}
async function insertNotification(data) {
    try {
        await client_1.db.query(`INSERT INTO notifications (user_id, type, title, body, reason_text, deep_link, source_event_id, dedupe_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id, dedupe_key) DO NOTHING`, [
            data.userId,
            data.type,
            data.title,
            data.body,
            data.reasonText ?? null,
            data.deepLink ?? null,
            data.sourceEventId ?? null,
            data.dedupeKey,
        ]);
        metrics_1.notificationsCreatedTotal.inc({ type: data.type });
    }
    catch (err) {
        console.error("Failed to insert notification:", err);
    }
}
