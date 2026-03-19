import { QueryResult, QueryResultRow } from "pg";
import { PlatformEvent } from "@gosupportme/contracts";
interface StoredEvent {
    id: number;
    event_id: string;
    type: string;
    payload: Record<string, unknown>;
    occurred_at: Date;
    ingested_at: Date;
}
interface Queryable {
    query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<QueryResult<T>>;
}
export declare function storeEvent(event: PlatformEvent, client?: Queryable): Promise<{
    stored: StoredEvent;
    isNew: boolean;
}>;
export declare function fanOutEvent(event: PlatformEvent): Promise<void>;
export declare function insertEvent(event: PlatformEvent): Promise<{
    stored: StoredEvent;
    isNew: boolean;
}>;
export declare function getEvent(eventId: string): Promise<StoredEvent | null>;
export declare function replayEvents(eventIds: string[]): Promise<{
    replayed: string[];
    notFound: string[];
}>;
export {};
