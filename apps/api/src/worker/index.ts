import { Worker, Job } from "bullmq";
import { createBullMQConnection } from "../db/redis";
import { processNotification } from "./processors/notifications";
import { processBadge } from "./processors/badges";
import { processRecommendation } from "./processors/recommendations";
import { jobsProcessedTotal } from "../observability/metrics";

const workerOptions = {
  connection: createBullMQConnection(),
  concurrency: 5,
};

function makeWorker<T>(
  queueName: string,
  processor: (job: Job<T>) => Promise<void>
): Worker {
  const worker = new Worker<T>(
    queueName,
    async (job: Job<T>) => {
      try {
        await processor(job);
        jobsProcessedTotal.inc({ queue: queueName, status: "completed" });
      } catch (err) {
        jobsProcessedTotal.inc({ queue: queueName, status: "failed" });
        throw err;
      }
    },
    workerOptions
  );

  worker.on("failed", (job, err) => {
    console.error(`[${queueName}] Job ${job?.id} failed:`, err.message);
  });

  worker.on("completed", (job) => {
    console.log(`[${queueName}] Job ${job.id} completed`);
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
