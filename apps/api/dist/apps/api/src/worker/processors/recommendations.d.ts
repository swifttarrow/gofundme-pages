import { Job } from "bullmq";
import { PlatformEvent } from "@gosupportme/contracts";
interface RecommendationJob {
    event: PlatformEvent;
}
export declare function processRecommendation(job: Job<RecommendationJob>): Promise<void>;
export {};
