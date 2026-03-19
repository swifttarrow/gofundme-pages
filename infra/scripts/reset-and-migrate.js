#!/usr/bin/env node
"use strict";

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

function loadEnvFromFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();
    if (!key || process.env[key] !== undefined) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function loadLocalEnv() {
  const rootDir = path.resolve(__dirname, "../..");
  loadEnvFromFile(path.join(rootDir, ".env.local"));
  loadEnvFromFile(path.join(rootDir, ".env"));
}

async function run() {
  loadLocalEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  console.log("Dropping public schema (all tables, data, and objects)...");
  await client.query("DROP SCHEMA IF EXISTS public CASCADE");
  await client.query("CREATE SCHEMA public");
  await client.query("GRANT ALL ON SCHEMA public TO public");
  console.log("  ✓ Schema reset complete.\n");

  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");
    console.log(`Running migration: ${file}`);
    await client.query(sql);
    console.log(`  ✓ ${file}`);
  }

  await client.end();
  console.log("\nAll migrations complete. Database is clean and up to date.");
}

run().catch((err) => {
  console.error("Reset/migration failed:", err);
  process.exit(1);
});
