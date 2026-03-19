import { Worker, Job } from "bullmq";
import { createBullMQConnection } from "../db/redis";
import { processNotification } from "./processors/notifications";
import { processBadge } from "./processors/badges";
import { processRecommendation } from "./processors/recommendations";
import {
  workerJobsStartedTotal,
  workerJobsCompletedTotal,
  workerJobsFailedTotal,
  workerJobDurationSeconds,
} from "../observability/metrics";
import { structuredLog, logError } from "../services/telemetry";

const workerOptions = {
  connection: createBullMQConnection(),
  concurrency: 5,
};

function queueToProcessor(queueName: string): string {
  switch (queueName) {
    case "notification-queue":
      return "notifications";
    case "badge-queue":
      return "badges";
    case "recommendation-queue":
      return "recommendations";
    default:
      return queueName;
  }
}

function eventIdFromJob(job: Job<{ event?: { eventId?: string } }>): string | undefined {
  return job.data?.event?.eventId;
}

function makeWorker<T>(
  queueName: string,
  processor: (job: Job<T>) => Promise<void>
): Worker {
  const processorLabel = queueToProcessor(queueName);

  const worker = new Worker<T>(
    queueName,
    async (job: Job<T>) => {
      const started = Date.now();
      workerJobsStartedTotal.inc({ processor: processorLabel });

      structuredLog("info", "worker.job.started", {
        processor: processorLabel,
        queue: queueName,
        job_id: String(job.id),
        attempt: job.attemptsMade + 1,
        event_id: eventIdFromJob(job as Job<{ event?: { eventId?: string } }>) ?? null,
      });

      try {
        await processor(job);
        const durationSec = (Date.now() - started) / 1000;
        workerJobsCompletedTotal.inc({ processor: processorLabel });
        workerJobDurationSeconds.observe({ processor: processorLabel }, durationSec);

        structuredLog("info", "worker.job.completed", {
          processor: processorLabel,
          queue: queueName,
          job_id: String(job.id),
          attempt: job.attemptsMade + 1,
          event_id: eventIdFromJob(job as Job<{ event?: { eventId?: string } }>) ?? null,
          duration_ms: Math.round(durationSec * 1000),
        });
      } catch (err) {
        const durationSec = (Date.now() - started) / 1000;
        workerJobsFailedTotal.inc({ processor: processorLabel });
        workerJobDurationSeconds.observe({ processor: processorLabel }, durationSec);

        logError("worker.job.failed", err, {
          processor: processorLabel,
          queue: queueName,
          job_id: String(job.id),
          attempt: job.attemptsMade + 1,
          event_id: eventIdFromJob(job as Job<{ event?: { eventId?: string } }>) ?? null,
          duration_ms: Math.round(durationSec * 1000),
        });
        throw err;
      }
    },
    workerOptions
  );

  worker.on("failed", (job, err) => {
    if (job && job.attemptsMade < (job.opts.attempts ?? 1)) {
      structuredLog("warn", "worker.job.retry_scheduled", {
        processor: processorLabel,
        queue: queueName,
        job_id: String(job.id),
        attempt: job.attemptsMade,
        max_attempts: job.opts.attempts ?? 1,
        event_id: eventIdFromJob(job as Job<{ event?: { eventId?: string } }>) ?? null,
        error_name: err instanceof Error ? err.name : "Error",
        error_message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return worker;
}

export function startWorkers(): { workers: Worker[]; shutdown: () => Promise<void> } {
  const workers = [
    makeWorker("notification-queue", processNotification),
    makeWorker("badge-queue", processBadge),
    makeWorker("recommendation-queue", processRecommendation),
  ];

  console.log("Workers started: notification-queue, badge-queue, recommendation-queue");

  return {
    workers,
    shutdown: async () => {
      await Promise.all(workers.map((w) => w.close()));
      console.log("All workers shut down");
    },
  };
}

// If run directly, start workers standalone
if (require.main === module) {
  const { shutdown } = startWorkers();

  process.on("SIGTERM", async () => {
    await shutdown();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await shutdown();
    process.exit(0);
  });
}
