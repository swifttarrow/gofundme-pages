import { Queue } from "bullmq";
import { createBullMQConnection } from "../db/redis";
import { workerQueueBacklog } from "../observability/metrics";

const QUEUE_NAMES = ["notification-queue", "badge-queue", "recommendation-queue"] as const;

/**
 * Periodically publishes BullMQ counts for backlog / saturation dashboards.
 */
export function startQueueMetricsPoller(intervalMs = 15_000): () => Promise<void> {
  const connection = createBullMQConnection();
  const queues = QUEUE_NAMES.map((name) => new Queue(name, { connection }));

  async function tick(): Promise<void> {
    for (const q of queues) {
      try {
        const counts = await q.getJobCounts("waiting", "delayed", "active", "failed");
        workerQueueBacklog.set({ queue: q.name, state: "waiting" }, counts.waiting ?? 0);
        workerQueueBacklog.set({ queue: q.name, state: "delayed" }, counts.delayed ?? 0);
        workerQueueBacklog.set({ queue: q.name, state: "active" }, counts.active ?? 0);
        workerQueueBacklog.set({ queue: q.name, state: "failed" }, counts.failed ?? 0);
      } catch {
        // Redis unavailable — skip this tick; health/metrics still surface other signals
      }
    }
  }

  void tick();
  const handle = setInterval(() => {
    void tick();
  }, intervalMs);

  return async () => {
    clearInterval(handle);
    await Promise.all(queues.map((q) => q.close()));
  };
}
