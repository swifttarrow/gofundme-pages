"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const load_env_1 = require("../config/load-env");
(0, load_env_1.loadLocalEnv)();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/gosupportme",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
pool.on("error", (err) => {
    console.error("Unexpected error on idle pg client", err);
});
exports.db = {
    query: (text, params) => pool.query(text, params),
    /** Run multiple queries in a single transaction */
    transaction: async (fn) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const result = await fn(client);
            await client.query("COMMIT");
            return result;
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    },
    end: () => pool.end(),
};
