#!/usr/bin/env node
"use strict";

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DEFAULT_TARGET_EMAIL = "kevin.chang@challenger.gauntletai.com";

const SUPPORT_USERS = [
  {
    id: "d9d8c7b6-1001-4001-8001-000000000001",
    email: "maria.lopez+gauntlet-seed@example.com",
    name: "Maria Lopez",
    bio: "Neighborhood volunteer focused on emergency relief and mutual aid.",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    location: "San Jose, CA",
    role: "organizer",
  },
  {
    id: "d9d8c7b6-1002-4002-8002-000000000002",
    email: "owen.brooks+gauntlet-seed@example.com",
    name: "Owen Brooks",
    bio: "Parent advocate helping classrooms get the resources they need.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    location: "Sacramento, CA",
    role: "organizer",
  },
  {
    id: "d9d8c7b6-1003-4003-8003-000000000003",
    email: "priya.shah+gauntlet-seed@example.com",
    name: "Priya Shah",
    bio: "Animal welfare volunteer organizing community rescue efforts.",
    avatarUrl: "https://i.pravatar.cc/150?img=13",
    location: "Seattle, WA",
    role: "organizer",
  },
];

const CAMPAIGNS = [
  {
    id: "e1f2a3b4-2001-4001-8001-000000000001",
    organizer: "target",
    title: "Kevin Chang Community Meal Train",
    story:
      "Kevin is organizing a month-long meal train for families navigating medical recovery. Funds cover groceries, prepared meals, and delivery support for households that need immediate help while loved ones heal.",
    coverImageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop",
    goalCents: 1250000,
    category: "Community",
    location: "San Francisco, CA",
    isUrgent: false,
    status: "active",
    createdAt: "2026-03-16T18:00:00.000Z",
  },
  {
    id: "e1f2a3b4-2002-4002-8002-000000000002",
    organizer: "target",
    title: "Back-to-School Kits for Bay Area Students",
    story:
      "Kevin is fundraising to assemble backpacks, notebooks, calculators, and transit cards for students starting the school year with limited resources. Every donation helps one more student show up ready to learn.",
    coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop",
    goalCents: 2500000,
    category: "Education",
    location: "Oakland, CA",
    isUrgent: false,
    status: "active",
    createdAt: "2026-03-17T18:00:00.000Z",
  },
  {
    id: "e1f2a3b4-2003-4003-8003-000000000003",
    organizer: "d9d8c7b6-1001-4001-8001-000000000001",
    title: "Fire Recovery Supplies for South Bay Families",
    story:
      "Maria is coordinating emergency hotel stays, clothing vouchers, and replacement essentials for families displaced after an apartment fire. The goal is to move quickly while insurance claims are still processing.",
    coverImageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop",
    goalCents: 4000000,
    category: "Emergency",
    location: "San Jose, CA",
    isUrgent: true,
    status: "active",
    createdAt: "2026-03-12T18:00:00.000Z",
  },
  {
    id: "e1f2a3b4-2004-4004-8004-000000000004",
    organizer: "d9d8c7b6-1002-4002-8002-000000000002",
    title: "Classroom Tech Refresh for Lincoln Middle School",
    story:
      "Owen is helping replace aging classroom laptops and headphones so teachers can run digital lessons without sharing devices between students. Donations will directly fund hardware purchases for the new semester.",
    coverImageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop",
    goalCents: 3200000,
    category: "Education",
    location: "Sacramento, CA",
    isUrgent: false,
    status: "active",
    createdAt: "2026-03-13T18:00:00.000Z",
  },
  {
    id: "e1f2a3b4-2005-4005-8005-000000000005",
    organizer: "d9d8c7b6-1003-4003-8003-000000000003",
    title: "Emergency Foster Care Fund for Rescued Pets",
    story:
      "Priya is building a bridge fund for short-term foster care, vet visits, and transport for pets rescued from overcrowded shelters. The fundraiser keeps animals safe while permanent placements are arranged.",
    coverImageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop",
    goalCents: 1800000,
    category: "Animals",
    location: "Seattle, WA",
    isUrgent: true,
    status: "active",
    createdAt: "2026-03-14T18:00:00.000Z",
  },
];

const DONATIONS = [
  {
    id: "f1a2b3c4-3001-4001-8001-000000000001",
    fundraiserId: "e1f2a3b4-2001-4001-8001-000000000001",
    donor: "d9d8c7b6-1001-4001-8001-000000000001",
    amountCents: 12500,
    tipCents: 0,
    totalCents: 12500,
    tipPercent: 0,
    isAnonymous: false,
    message: "Happy to support your meal train effort.",
    createdAt: "2026-03-16T19:10:00.000Z",
  },
  {
    id: "f1a2b3c4-3002-4002-8002-000000000002",
    fundraiserId: "e1f2a3b4-2001-4001-8001-000000000001",
    donor: "d9d8c7b6-1002-4002-8002-000000000002",
    amountCents: 20000,
    tipCents: 0,
    totalCents: 20000,
    tipPercent: 0,
    isAnonymous: false,
    message: "Love seeing this kind of practical community support.",
    createdAt: "2026-03-16T20:25:00.000Z",
  },
  {
    id: "f1a2b3c4-3003-4003-8003-000000000003",
    fundraiserId: "e1f2a3b4-2002-4002-8002-000000000002",
    donor: "d9d8c7b6-1003-4003-8003-000000000003",
    amountCents: 15000,
    tipCents: 0,
    totalCents: 15000,
    tipPercent: 0,
    isAnonymous: false,
    message: "Thanks for helping students start strong.",
    createdAt: "2026-03-17T19:40:00.000Z",
  },
  {
    id: "f1a2b3c4-3004-4004-8004-000000000004",
    fundraiserId: "e1f2a3b4-2003-4003-8003-000000000003",
    donor: "target",
    amountCents: 4500,
    tipCents: 0,
    totalCents: 4500,
    tipPercent: 0,
    isAnonymous: false,
    message: "Glad to help these families recover quickly.",
    createdAt: "2026-03-17T08:30:00.000Z",
  },
  {
    id: "f1a2b3c4-3005-4005-8005-000000000005",
    fundraiserId: "e1f2a3b4-2004-4004-8004-000000000004",
    donor: "target",
    amountCents: 6500,
    tipCents: 0,
    totalCents: 6500,
    tipPercent: 0,
    isAnonymous: false,
    message: "Excited to chip in for better classroom gear.",
    createdAt: "2026-03-18T09:10:00.000Z",
  },
  {
    id: "f1a2b3c4-3006-4006-8006-000000000006",
    fundraiserId: "e1f2a3b4-2005-4005-8005-000000000005",
    donor: "target",
    amountCents: 8000,
    tipCents: 0,
    totalCents: 8000,
    tipPercent: 0,
    isAnonymous: false,
    message: "Rooting for these rescue placements.",
    createdAt: "2026-03-18T10:45:00.000Z",
  },
];

const FAVORITES = [
  {
    id: "0a1b2c3d-4001-4001-8001-000000000001",
    fundraiserId: "e1f2a3b4-2003-4003-8003-000000000003",
    createdAt: "2026-03-18T11:00:00.000Z",
  },
  {
    id: "0a1b2c3d-4002-4002-8002-000000000002",
    fundraiserId: "e1f2a3b4-2004-4004-8004-000000000004",
    createdAt: "2026-03-18T11:05:00.000Z",
  },
  {
    id: "0a1b2c3d-4003-4003-8003-000000000003",
    fundraiserId: "e1f2a3b4-2005-4005-8005-000000000005",
    createdAt: "2026-03-18T11:10:00.000Z",
  },
];

const NOTIFICATIONS = [
  {
    id: "1b2c3d4e-5001-4001-8001-000000000001",
    type: "donation_received",
    title: 'New donation of $200.00 to "Kevin Chang Community Meal Train"',
    body: "A donor contributed to your fundraiser.",
    reasonText: "You are the organizer of this fundraiser",
    deepLink: "/fundraiser/e1f2a3b4-2001-4001-8001-000000000001",
    isRead: false,
    isBundled: false,
    bundleCount: 1,
    dedupeKey: "kevin-seed-donation-received-meal-train",
    createdAt: "2026-03-16T20:30:00.000Z",
  },
  {
    id: "1b2c3d4e-5002-4002-8002-000000000002",
    type: "donation_received",
    title: 'New donation of $150.00 to "Back-to-School Kits for Bay Area Students"',
    body: "A donor contributed to your fundraiser.",
    reasonText: "You are the organizer of this fundraiser",
    deepLink: "/fundraiser/e1f2a3b4-2002-4002-8002-000000000002",
    isRead: false,
    isBundled: false,
    bundleCount: 1,
    dedupeKey: "kevin-seed-donation-received-school-kits",
    createdAt: "2026-03-17T19:45:00.000Z",
  },
  {
    id: "1b2c3d4e-5003-4003-8003-000000000003",
    type: "fundraiser_update",
    title: "Update from Fire Recovery Supplies for South Bay Families",
    body: "Maria shared that hotel placements are now secured for three families.",
    reasonText: "Because you follow this fundraiser",
    deepLink: "/fundraiser/e1f2a3b4-2003-4003-8003-000000000003",
    isRead: false,
    isBundled: false,
    bundleCount: 1,
    dedupeKey: "kevin-seed-followed-fundraiser-update-fire-recovery",
    createdAt: "2026-03-18T12:15:00.000Z",
  },
  {
    id: "1b2c3d4e-5004-4004-8004-000000000004",
    type: "community_activity",
    title: "Three causes you follow are gaining momentum",
    body: "Emergency relief, classroom tech, and foster care fundraisers all saw new activity today.",
    reasonText: "Because you follow these fundraisers",
    deepLink: "/notifications",
    isRead: true,
    isBundled: true,
    bundleCount: 3,
    dedupeKey: "kevin-seed-community-activity-roundup",
    createdAt: "2026-03-18T13:00:00.000Z",
  },
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

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function resolveOrganizerId(organizer, targetUserId) {
  return organizer === "target" ? targetUserId : organizer;
}

function resolveDonorId(donor, targetUserId) {
  return donor === "target" ? targetUserId : donor;
}

async function upsertSupportUsers(client) {
  const seedPassword = process.env.DEV_AUTH_PASSWORD || "gosupportme-dev-password";
  const seedPasswordHash = hashPassword(seedPassword);

  for (const user of SUPPORT_USERS) {
    await client.query(
      `INSERT INTO users (id, email, name, bio, avatar_url, location, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE
       SET email = EXCLUDED.email,
           name = EXCLUDED.name,
           bio = EXCLUDED.bio,
           avatar_url = EXCLUDED.avatar_url,
           location = EXCLUDED.location,
           role = EXCLUDED.role,
           password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash)`,
      [
        user.id,
        user.email,
        user.name,
        user.bio,
        user.avatarUrl,
        user.location,
        user.role,
        seedPasswordHash,
      ]
    );
  }
}

async function upsertCampaigns(client, targetUserId) {
  for (const campaign of CAMPAIGNS) {
    await client.query(
      `INSERT INTO fundraisers (
         id,
         organizer_id,
         title,
         story,
         cover_image_url,
         goal_cents,
         raised_cents,
         category,
         location,
         is_urgent,
         status,
         donor_count,
         follower_count,
         created_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, 0, $7, $8, $9, $10, 0, 0, $11)
       ON CONFLICT (id) DO UPDATE
       SET organizer_id = EXCLUDED.organizer_id,
           title = EXCLUDED.title,
           story = EXCLUDED.story,
           cover_image_url = EXCLUDED.cover_image_url,
           goal_cents = EXCLUDED.goal_cents,
           category = EXCLUDED.category,
           location = EXCLUDED.location,
           is_urgent = EXCLUDED.is_urgent,
           status = EXCLUDED.status,
           updated_at = NOW()`,
      [
        campaign.id,
        resolveOrganizerId(campaign.organizer, targetUserId),
        campaign.title,
        campaign.story,
        campaign.coverImageUrl,
        campaign.goalCents,
        campaign.category,
        campaign.location,
        campaign.isUrgent,
        campaign.status,
        campaign.createdAt,
      ]
    );
  }
}

async function insertDonation(client, donation, targetUserId) {
  const result = await client.query(
    `INSERT INTO donations (
       id,
       fundraiser_id,
       donor_user_id,
       amount_cents,
       tip_cents,
       total_cents,
       tip_percent,
       is_anonymous,
       message,
       created_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    [
      donation.id,
      donation.fundraiserId,
      resolveDonorId(donation.donor, targetUserId),
      donation.amountCents,
      donation.tipCents,
      donation.totalCents,
      donation.tipPercent,
      donation.isAnonymous,
      donation.message,
      donation.createdAt,
    ]
  );

  if (result.rowCount === 0) return false;

  await client.query(
    `UPDATE fundraisers
     SET raised_cents = raised_cents + $1,
         donor_count = donor_count + 1,
         updated_at = NOW()
     WHERE id = $2`,
    [donation.amountCents, donation.fundraiserId]
  );

  return true;
}

async function insertFavorite(client, favorite, targetUserId) {
  const result = await client.query(
    `INSERT INTO follows (id, follower_id, fundraiser_id, created_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (follower_id, fundraiser_id) DO NOTHING
     RETURNING id`,
    [favorite.id, targetUserId, favorite.fundraiserId, favorite.createdAt]
  );

  if (result.rowCount === 0) return false;

  await client.query(
    `UPDATE fundraisers
     SET follower_count = follower_count + 1,
         updated_at = NOW()
     WHERE id = $1`,
    [favorite.fundraiserId]
  );

  return true;
}

async function insertNotification(client, notification, targetUserId) {
  const result = await client.query(
    `INSERT INTO notifications (
       id,
       user_id,
       type,
       title,
       body,
       reason_text,
       deep_link,
       is_read,
       is_bundled,
       bundle_count,
       dedupe_key,
       created_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (user_id, dedupe_key) DO NOTHING
     RETURNING id`,
    [
      notification.id,
      targetUserId,
      notification.type,
      notification.title,
      notification.body,
      notification.reasonText,
      notification.deepLink,
      notification.isRead,
      notification.isBundled,
      notification.bundleCount,
      notification.dedupeKey,
      notification.createdAt,
    ]
  );

  return result.rowCount > 0;
}

async function getTargetUser(client, email) {
  const result = await client.query(
    `SELECT id, email, name
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
}

async function getSummary(client, targetUserId) {
  const fundraisers = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM fundraisers
     WHERE organizer_id = $1`,
    [targetUserId]
  );
  const donations = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM donations
     WHERE donor_user_id = $1`,
    [targetUserId]
  );
  const favorites = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM follows
     WHERE follower_id = $1`,
    [targetUserId]
  );
  const notifications = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM notifications
     WHERE user_id = $1`,
    [targetUserId]
  );

  return {
    fundraiserCount: fundraisers.rows[0]?.count ?? 0,
    donationCount: donations.rows[0]?.count ?? 0,
    favoriteCount: favorites.rows[0]?.count ?? 0,
    notificationCount: notifications.rows[0]?.count ?? 0,
  };
}

async function run() {
  loadLocalEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const targetEmail = process.argv[2] || process.env.TARGET_EMAIL || DEFAULT_TARGET_EMAIL;
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const targetUser = await getTargetUser(client, targetEmail);
    if (!targetUser) {
      throw new Error(`No user found for ${targetEmail}. Create or sign into that account first.`);
    }

    console.log(`Seeding account data for ${targetUser.email} (${targetUser.name})...`);
    await client.query("BEGIN");

    await upsertSupportUsers(client);
    await upsertCampaigns(client, targetUser.id);

    let createdDonations = 0;
    for (const donation of DONATIONS) {
      if (await insertDonation(client, donation, targetUser.id)) {
        createdDonations += 1;
      }
    }

    let createdFavorites = 0;
    for (const favorite of FAVORITES) {
      if (await insertFavorite(client, favorite, targetUser.id)) {
        createdFavorites += 1;
      }
    }

    let createdNotifications = 0;
    for (const notification of NOTIFICATIONS) {
      if (await insertNotification(client, notification, targetUser.id)) {
        createdNotifications += 1;
      }
    }

    await client.query("COMMIT");

    const summary = await getSummary(client, targetUser.id);
    const followeeOrganizerCount = new Set(
      CAMPAIGNS.filter((campaign) =>
        FAVORITES.some((favorite) => favorite.fundraiserId === campaign.id)
      ).map((campaign) => resolveOrganizerId(campaign.organizer, targetUser.id))
    ).size;

    console.log("  ✓ support users ready");
    console.log(`  ✓ ${CAMPAIGNS.filter((campaign) => campaign.organizer === "target").length} Kevin fundraisers ensured`);
    console.log(`  ✓ ${createdDonations} new donations inserted`);
    console.log(`  ✓ ${createdFavorites} new favorites inserted (stored in follows)`);
    console.log(`  ✓ ${createdNotifications} new notifications inserted`);
    console.log("");
    console.log(`Account summary for ${targetUser.email}:`);
    console.log(`  Fundraisers: ${summary.fundraiserCount}`);
    console.log(`  Donations made: ${summary.donationCount}`);
    console.log(`  Favorites/follows: ${summary.favoriteCount}`);
    console.log(`  Notifications: ${summary.notificationCount}`);
    console.log(`  Followee organizers represented: ${followeeOrganizerCount}`);
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Ignore rollback errors when the transaction never started.
    }
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  if (err?.code === "42P01") {
    console.error("Account seed failed: required tables do not exist. Run `npm run db:migrate` first.");
  }

  console.error("Account seed failed:", err.message || err);
  process.exit(1);
});
