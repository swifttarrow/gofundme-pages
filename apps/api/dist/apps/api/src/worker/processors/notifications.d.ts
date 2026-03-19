import { Job } from "bullmq";
import { PlatformEvent } from "@gosupportme/contracts";
interface NotificationJob {
    event: PlatformEvent;
}
export declare function processNotification(job: Job<NotificationJob>): Promise<void>;
export {};
