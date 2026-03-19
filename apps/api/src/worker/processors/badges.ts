import { Job } from "bullmq";
import { PlatformEvent } from "@gosupportme/contracts";
import { db } from "../../db/client";
import { jobsProcessedTotal } from "../../observability/metrics";
import { evaluateAndAwardBadges } from "../../services/badges";

interface BadgeJob {
  event: PlatformEvent;
}

export async function processBadge(job: Job<BadgeJob>): Promise<void> {
  const { event } = job.data;

  const userIds = await extractRelevantUserIds(event);

  for (const userId of userIds) {
    try {
      await evaluateAndAwardBadges(userId, {
        sourceEventId: event.eventId,
        trigger: event.type,
      });
    } catch (err) {
      console.error(`Badge evaluation failed for user ${userId}:`, err);
    }
  }

  jobsProcessedTotal.inc({ queue: "badge-queue", status: "completed" });
}

async function extractRelevantUserIds(event: PlatformEvent): Promise<string[]> {
  switch (event.type) {
    case "fundraiser.created":
      return [event.payload.organizerUserId];
    case "donation.created": {
      const fundraiser = await db.query<{ organizer_id: string }>(
        "SELECT organizer_id FROM fundraisers WHERE id = $1 LIMIT 1",
        [event.payload.fundraiserId]
      );

      const userIds = new Set<string>();
      if (event.payload.donorUserId) userIds.add(event.payload.donorUserId);
      const organizerId = fundraiser.rows[0]?.organizer_id;
      if (organizerId) userIds.add(organizerId);
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
