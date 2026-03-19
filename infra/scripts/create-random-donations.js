#!/usr/bin/env node
"use strict";

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DONATIONS_PER_FUNDRAISER = 3;
const MIN_DONATION_CENTS = 500;
const MAX_DONATION_CENTS = 100000;
const DONATION_MESSAGES = [
  "Sending support and hope.",
  "Wishing you strength during this time.",
  "Happy to help however I can.",
  "Keeping you in my thoughts.",
  "Rooting for this fundraiser.",
  "Hope this helps a little."
];

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
    if (!key) continue;

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

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseRandom(items) {
  return items[randomInteger(0, items.length - 1)];
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

  try {
    const fundraiserResult = await client.query(`
      SELECT id, organizer_id, title
      FROM fundraisers
      ORDER BY created_at ASC, id ASC
    `);
    const userResult = await client.query(`
      SELECT id
      FROM users
      ORDER BY id ASC
    `);

    const fundraisers = fundraiserResult.rows;
    const users = userResult.rows;

    if (fundraisers.length === 0) {
      console.log("No fundraisers found. Nothing to do.");
      return;
    }

    if (users.length === 0) {
      console.log("No users found. Nothing to do.");
      return;
    }

    console.log(
      `Creating ${DONATIONS_PER_FUNDRAISER} donations for each of ${fundraisers.length} fundraisers...`
    );

    let totalCreated = 0;
    let totalRaisedCents = 0;

    await client.query("BEGIN");

    for (const fundraiser of fundraisers) {
      const donorPool = users.filter((user) => user.id !== fundraiser.organizer_id);
      const eligibleDonors = donorPool.length > 0 ? donorPool : users;

      let fundraiserRaisedCents = 0;

      for (let index = 0; index < DONATIONS_PER_FUNDRAISER; index += 1) {
        const donor = chooseRandom(eligibleDonors);
        const amountCents = randomInteger(MIN_DONATION_CENTS, MAX_DONATION_CENTS);
        const message = chooseRandom(DONATION_MESSAGES);

        await client.query(
          `INSERT INTO donations (
             id,
             fundraiser_id,
             donor_user_id,
             amount_cents,
             tip_cents,
             total_cents,
             tip_percent,
             is_anonymous,
             message
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            crypto.randomUUID(),
            fundraiser.id,
            donor.id,
            amountCents,
            0,
            amountCents,
            0,
            false,
            message
          ]
        );

        fundraiserRaisedCents += amountCents;
      }

      await client.query(
        `UPDATE fundraisers
         SET raised_cents = raised_cents + $1,
             donor_count = donor_count + $2,
             updated_at = NOW()
         WHERE id = $3`,
        [fundraiserRaisedCents, DONATIONS_PER_FUNDRAISER, fundraiser.id]
      );

      totalCreated += DONATIONS_PER_FUNDRAISER;
      totalRaisedCents += fundraiserRaisedCents;

      console.log(
        `  ✓ ${fundraiser.title}: ${DONATIONS_PER_FUNDRAISER} donations, +$${(
          fundraiserRaisedCents / 100
        ).toFixed(2)}`
      );
    }

    await client.query("COMMIT");

    console.log("");
    console.log(`Created ${totalCreated} donations total.`);
    console.log(`Added $${(totalRaisedCents / 100).toFixed(2)} across all fundraisers.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  if (err?.code === "42P01") {
    console.error("Donation generation failed: required tables do not exist. Run `npm run db:migrate` first.");
  }

  console.error("Donation generation failed:", err);
  process.exit(1);
});
