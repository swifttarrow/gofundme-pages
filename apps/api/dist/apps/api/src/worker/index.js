"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkers = startWorkers;
const bullmq_1 = require("bullmq");
const redis_1 = require("../db/redis");
const notifications_1 = require("./processors/notifications");
const badges_1 = require("./processors/badges");
const recommendations_1 = require("./processors/recommendations");
const metrics_1 = require("../observability/metrics");
const workerOptions = {
    connection: (0, redis_1.createBullMQConnection)(),
    concurrency: 5,
};
function makeWorker(queueName, processor) {
    const worker = new bullmq_1.Worker(queueName, async (job) => {
        try {
            await processor(job);
            metrics_1.jobsProcessedTotal.inc({ queue: queueName, status: "completed" });
        }
        catch (err) {
            metrics_1.jobsProcessedTotal.inc({ queue: queueName, status: "failed" });
            throw err;
        }
    }, workerOptions);
    worker.on("failed", (job, err) => {
        console.error(`[${queueName}] Job ${job?.id} failed:`, err.message);
    });
    worker.on("completed", (job) => {
        console.log(`[${queueName}] Job ${job.id} completed`);
    });
    return worker;
}
function startWorkers() {
    const workers = [
        makeWorker("notification-queue", notifications_1.processNotification),
        makeWorker("badge-queue", badges_1.processBadge),
        makeWorker("recommendation-queue", recommendations_1.processRecommendation),
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
