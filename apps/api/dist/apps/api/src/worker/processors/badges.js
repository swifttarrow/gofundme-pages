"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBadge = processBadge;
const client_1 = require("../../db/client");
const metrics_1 = require("../../observability/metrics");
const badges_1 = require("../../services/badges");
async function processBadge(job) {
    const { event } = job.data;
    const userIds = await extractRelevantUserIds(event);
    for (const userId of userIds) {
        try {
            await (0, badges_1.evaluateAndAwardBadges)(userId, { sourceEventId: event.eventId });
        }
        catch (err) {
            console.error(`Badge evaluation failed for user ${userId}:`, err);
        }
    }
    metrics_1.jobsProcessedTotal.inc({ queue: "badge-queue", status: "completed" });
}
async function extractRelevantUserIds(event) {
    switch (event.type) {
        case "donation.created": {
            const fundraiser = await client_1.db.query("SELECT organizer_id FROM fundraisers WHERE id = $1 LIMIT 1", [event.payload.fundraiserId]);
            const userIds = new Set();
            if (event.payload.donorUserId)
                userIds.add(event.payload.donorUserId);
            const organizerId = fundraiser.rows[0]?.organizer_id;
            if (organizerId)
                userIds.add(organizerId);
            return Array.from(userIds);
        }
        case "fundraiser.update_posted":
            return [event.payload.organizerUserId];
        case "fundraiser.followed":
            return [event.payload.followerUserId];
        case "profile.updated":
            return [event.payload.userId];
        default:
            return [];
    }
}
