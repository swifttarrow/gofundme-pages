import { Job } from "bullmq";
import { PlatformEvent } from "@gosupportme/contracts";
interface BadgeJob {
    event: PlatformEvent;
}
export declare function processBadge(job: Job<BadgeJob>): Promise<void>;
export {};
