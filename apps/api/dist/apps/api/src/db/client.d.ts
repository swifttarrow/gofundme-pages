import { PoolClient, QueryResult, QueryResultRow } from "pg";
export declare const db: {
    query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<QueryResult<T>>;
    /** Run multiple queries in a single transaction */
    transaction: <T>(fn: (client: PoolClient) => Promise<T>) => Promise<T>;
    end: () => Promise<void>;
};
