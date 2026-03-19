import { Worker } from "bullmq";
export declare function startWorkers(): {
    workers: Worker[];
    shutdown: () => Promise<void>;
};
