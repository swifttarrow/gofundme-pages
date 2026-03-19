#!/usr/bin/env node
"use strict";

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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
  // Prioritize local overrides in development.
  loadEnvFromFile(path.join(rootDir, ".env.local"));
  loadEnvFromFile(path.join(rootDir, ".env"));
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
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

  console.log("Seeding users...");
  const seedPassword = process.env.DEV_AUTH_PASSWORD || "gosupportme-dev-password";
  const seedPasswordHash = hashPassword(seedPassword);
  const users = await client.query(`
    INSERT INTO users (id, email, name, bio, avatar_url, location, role, password_hash)
    VALUES
      ('a1b2c3d4-0001-0001-0001-000000000001', 'sarah@example.com', 'Sarah Johnson', 'Community organizer and advocate.', 'https://i.pravatar.cc/150?img=1', 'San Francisco, CA', 'organizer', '${seedPasswordHash}'),
      ('a1b2c3d4-0002-0002-0002-000000000002', 'michael@example.com', 'Michael Chen', 'Proud supporter of local causes.', 'https://i.pravatar.cc/150?img=2', 'Oakland, CA', 'donor', '${seedPasswordHash}'),
      ('a1b2c3d4-0003-0003-0003-000000000003', 'jessica@example.com', 'Jessica Rivera', 'Social worker and fundraising champion.', 'https://i.pravatar.cc/150?img=3', 'Berkeley, CA', 'organizer', '${seedPasswordHash}'),
      ('a1b2c3d4-0004-0004-0004-000000000004', 'anonymous@example.com', 'Anonymous Donor', NULL, NULL, NULL, 'donor', '${seedPasswordHash}'),
      ('a1b2c3d4-0005-0005-0005-000000000005', 'junisha@example.com', 'Junisha Bhorman', 'Passionate about education and community resilience.', 'https://i.pravatar.cc/150?img=5', 'Los Angeles, CA', 'organizer', '${seedPasswordHash}')
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        bio = EXCLUDED.bio,
        avatar_url = EXCLUDED.avatar_url,
        location = EXCLUDED.location,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash
    RETURNING id;
  `);
  console.log(`  ✓ ${users.rowCount} users`);

  console.log("Seeding fundraisers...");
  const fundraisers = await client.query(`
    INSERT INTO fundraisers (id, organizer_id, title, story, cover_image_url, goal_cents, raised_cents, category, location, is_urgent, status, donor_count)
    VALUES
      ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001',
       'Help the Martinez Family Rebuild After the Fire',
       'On the evening of March 2nd, the Martinez family lost their home to an unexpected electrical fire. Carlos, Maria, and their three children—ages 4, 7 and 12—escaped with only the clothes on their backs. The fire destroyed everything: their belongings, photos, important documents, and the home they had lived in for over 15 years. The family is currently staying with relatives while they figure out their next steps. Carlos serves as a mechanical in Atlanta in a teaching assistant at the local elementary school. They are hardworking, loving parents who have always been there for their community.',
       'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800', 5000000, 2845000, 'Emergency', 'Atlanta, GA', true, 'active', 847),
      ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0003-0003-0003-000000000003',
       'Support Donna Cancer Treatment Journey',
       'Donna was diagnosed with stage 3 breast cancer last month. She is a single mother of two who works tirelessly as a nurse. Medical bills are mounting and she needs our support to focus on recovery.',
       'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', 8000000, 9855000, 'Medical', 'Chicago, IL', false, 'active', 1203),
      ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0005-0005-0005-000000000005',
       'New Playground for Lincoln Elementary',
       'Lincoln Elementary''s playground equipment is over 20 years old and has become unsafe. We are raising funds to build a brand new, inclusive playground that every child can enjoy.',
       'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800', 3500000, 857500, 'Education', 'Los Angeles, CA', false, 'active', 214),
      ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0001-0001-0001-000000000001',
       'Help Rebuild After the Storm',
       'Our neighborhood was devastated by flooding last week. Dozens of families are displaced and need immediate assistance with food, shelter, and rebuilding costs.',
       'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 10000000, 11062000, 'Emergency', 'Houston, TX', true, 'active', 2847),
      ('b1b2c3d4-0005-0005-0005-000000000005', 'a1b2c3d4-0003-0003-0003-000000000003',
       'Build a Community Garden',
       'We want to transform an unused lot into a thriving community garden that provides fresh produce for local families and a gathering place for neighbors.',
       'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', 1500000, 3976000, 'Community', 'Portland, OR', false, 'active', 891),
      ('b1b2c3d4-0006-0006-0006-000000000006', 'a1b2c3d4-0005-0005-0005-000000000005',
       'Veterans Mental Health Initiative',
       'Supporting veterans struggling with PTSD and mental health challenges. Funds go directly to therapy sessions and support group programs.',
       'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800', 5000000, 5270000, 'Community', 'Washington, DC', false, 'active', 643),
      ('b1b2c3d4-0007-0007-0007-000000000007', 'a1b2c3d4-0001-0001-0001-000000000001',
       'Send Underserved Kids to Coding Camp',
       'Help us send 50 kids from underserved communities to a week-long coding bootcamp this summer, teaching them the skills for tomorrow''s economy.',
       'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', 2500000, 8856000, 'Education', 'San Francisco, CA', false, 'active', 1876),
      ('b1b2c3d4-0008-0008-0008-000000000008', 'a1b2c3d4-0003-0003-0003-000000000003',
       'Save the Paws Animal Shelter from Closing',
       'Our local no-kill shelter is at risk of closing due to funding cuts. Help us keep our doors open and continue saving animals.',
       'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', 6000000, 9179000, 'Animals', 'Denver, CO', true, 'active', 2341),
      ('b1b2c3d4-0009-0009-0009-000000000009', 'a1b2c3d4-0005-0005-0005-000000000005',
       'Help a Little Boy Get a Life-Saving Heart Surgery',
       'Eight-year-old Eli needs open heart surgery to correct a congenital defect. Insurance only covers a portion of the costs. His family needs our help urgently.',
       'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800', 15000000, 8837000, 'Medical', 'Boston, MA', true, 'active', 1120),
      ('b1b2c3d4-0010-0010-0010-000000000010', 'a1b2c3d4-0001-0001-0001-000000000001',
       'College Fund for Displaced Students',
       'Students who lost their homes in the wildfire now face losing their education too. Help us keep their college dreams alive.',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', 4000000, 4068000, 'Education', 'Santa Barbara, CA', false, 'active', 567)
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        story = EXCLUDED.story,
        cover_image_url = EXCLUDED.cover_image_url,
        goal_cents = EXCLUDED.goal_cents,
        raised_cents = EXCLUDED.raised_cents,
        category = EXCLUDED.category,
        location = EXCLUDED.location,
        is_urgent = EXCLUDED.is_urgent,
        status = EXCLUDED.status,
        donor_count = EXCLUDED.donor_count
    RETURNING id;
  `);
  console.log(`  ✓ ${fundraisers.rowCount} fundraisers`);

  console.log("Seeding donations...");
  const donations = await client.query(`
    INSERT INTO donations (fundraiser_id, donor_user_id, amount_cents, tip_cents, total_cents, tip_percent, is_anonymous, message)
    VALUES
      ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002', 15000, 1500, 16500, 10, false, 'Sending love and prayers to the Martinez family. Stay strong!'),
      ('b1b2c3d4-0001-0001-0001-000000000001', NULL, 10000, 1000, 11000, 10, true, 'Sending love and caring units in difficult times.'),
      ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0003-0003-0003-000000000003', 9000, 900, 9900, 10, false, 'This community is here for you. Every little helps.'),
      ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002', 25000, 2500, 27500, 10, false, 'Fighting for you Donna! You''ve got this.'),
      ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0005-0005-0005-000000000005', 5000, 500, 5500, 10, false, 'Our kids deserve better. Thank you for doing this!')
    ON CONFLICT DO NOTHING
    RETURNING id;
  `);
  console.log(`  ✓ ${donations.rowCount} donations`);

  console.log("Seeding follows...");
  await client.query(`
    INSERT INTO follows (follower_id, fundraiser_id)
    VALUES
      ('a1b2c3d4-0002-0002-0002-000000000002', 'b1b2c3d4-0001-0001-0001-000000000001'),
      ('a1b2c3d4-0003-0003-0003-000000000003', 'b1b2c3d4-0001-0001-0001-000000000001'),
      ('a1b2c3d4-0005-0005-0005-000000000005', 'b1b2c3d4-0002-0002-0002-000000000002')
    ON CONFLICT DO NOTHING;
  `);
  console.log("  ✓ follows");

  await client.end();
  console.log("\nSeed complete!");
}

run().catch((err) => {
  if (err?.code === "42P01") {
    console.error("Seed failed: required tables do not exist. Run `npm run db:migrate` first.");
  }
  console.error("Seed failed:", err);
  process.exit(1);
});
