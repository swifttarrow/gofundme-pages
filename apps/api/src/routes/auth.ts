import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { z } from "zod";
import { db } from "../db/client";
import { insertEvent } from "../services/event-ingestion";

const SESSION_COOKIE_NAME = "gosupportme_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SCRYPT_KEY_LENGTH = 64;
const scryptAsync = promisify(scrypt);

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().trim().min(1).max(120),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z.string().url().max(2_000_000).optional(),
  location: z.string().trim().max(120).optional(),
});

const UpdateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    bio: z.union([z.string().trim().max(500), z.null()]).optional(),
    avatarUrl: z.union([z.string().url().max(2_000_000), z.null()]).optional(),
    backsplashUrl: z.union([z.string().url().max(2_000_000), z.null()]).optional(),
    location: z.union([z.string().trim().max(120), z.null()]).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required",
  });

type SessionClaims = {
  sub: string;
  email: string;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
  backsplashUrl: string | null;
  location: string | null;
  passwordHash: string | null;
};

function parseCookieValue(cookieHeader: string | undefined, cookieName: string): string | null {
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName !== cookieName) continue;
    return rest.join("=") || null;
  }
  return null;
}

function buildSessionCookie(token: string): string {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secureFlag}`;
}

function buildExpiredSessionCookie(): string {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

async function getUserById(id: string): Promise<UserRow | null> {
  const result = await db.query<UserRow>(
    `SELECT id, email, name, role, bio, avatar_url AS "avatarUrl",
            backsplash_url AS "backsplashUrl", location, password_hash AS "passwordHash"
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
  return result.rows[0] ?? null;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, SCRYPT_KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string | null): Promise<boolean> {
  if (!storedHash) return false;

  const [algorithm, salt, expectedHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) {
    return false;
  }

  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
  if (actual.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(actual, expected);
}

async function authenticateRequest(
  app: FastifyInstance,
  request: FastifyRequest
): Promise<UserRow | null> {
  const token = parseCookieValue(request.headers.cookie, SESSION_COOKIE_NAME);
  if (!token) return null;

  try {
    const claims = await app.jwt.verify<SessionClaims>(token);
    return await getUserById(claims.sub);
  } catch {
    return null;
  }
}

function serializeUser(user: UserRow) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    backsplashUrl: user.backsplashUrl,
    location: user.location,
  };
}

function normalizeOptionalText(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/auth/register */
  app.post("/api/auth/register", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = RegisterSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const normalizedEmail = parse.data.email.trim().toLowerCase();
    const existingUser = await db.query<{ id: string }>(
      `SELECT id
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [normalizedEmail]
    );
    if (existingUser.rows[0]) {
      return reply.status(409).send({ error: "Email already in use" });
    }

    const passwordHash = await hashPassword(parse.data.password);
    const userResult = await db.query<UserRow>(
      `INSERT INTO users (email, name, bio, avatar_url, location, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, 'donor', $6)
       RETURNING id, email, name, role, bio, avatar_url AS "avatarUrl",
                 backsplash_url AS "backsplashUrl", location, password_hash AS "passwordHash"`,
      [
        normalizedEmail,
        parse.data.name.trim(),
        normalizeOptionalText(parse.data.bio),
        normalizeOptionalText(parse.data.avatarUrl),
        normalizeOptionalText(parse.data.location),
        passwordHash,
      ]
    );
    const user = userResult.rows[0];

    const token = await reply.jwtSign(
      { email: user.email },
      {
        sub: user.id,
        expiresIn: `${SESSION_MAX_AGE_SECONDS}s`,
      }
    );

    reply.header("Set-Cookie", buildSessionCookie(token));
    return reply.status(201).send({ user: serializeUser(user) });
  });

  /** POST /api/auth/login */
  app.post("/api/auth/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = LoginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { email, password } = parse.data;
    const userResult = await db.query<UserRow>(
      `SELECT id, email, name, role, bio, avatar_url AS "avatarUrl",
              backsplash_url AS "backsplashUrl", location, password_hash AS "passwordHash"
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email]
    );
    const user = userResult.rows[0];
    if (!user) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    let passwordIsValid = await verifyPassword(password, user.passwordHash);
    if (!passwordIsValid) {
      // Backward-compatible path for old seeded users without password hashes.
      const devPassword = process.env.DEV_AUTH_PASSWORD ?? "gosupportme-dev-password";
      if (!user.passwordHash && password === devPassword) {
        const upgradedHash = await hashPassword(password);
        await db.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [upgradedHash, user.id]);
        passwordIsValid = true;
      }
    }

    if (!passwordIsValid) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    const token = await reply.jwtSign(
      { email: user.email },
      {
        sub: user.id,
        expiresIn: `${SESSION_MAX_AGE_SECONDS}s`,
      }
    );

    reply.header("Set-Cookie", buildSessionCookie(token));

    return reply.send({ user: serializeUser(user) });
  });

  /** GET /api/auth/me */
  app.get("/api/auth/me", async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await authenticateRequest(app, request);
    if (!user) {
      return reply.status(401).send({ error: "Not authenticated" });
    }

    return reply.send({ user: serializeUser(user) });
  });

  /** PATCH /api/auth/profile */
  app.patch("/api/auth/profile", async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await authenticateRequest(app, request);
    if (!user) {
      return reply.status(401).send({ error: "Not authenticated" });
    }

    const parse = UpdateProfileSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (parse.data.name !== undefined) {
      values.push(parse.data.name.trim());
      updates.push(`name = $${values.length}`);
    }
    if (parse.data.bio !== undefined) {
      values.push(normalizeOptionalText(parse.data.bio));
      updates.push(`bio = $${values.length}`);
    }
    if (parse.data.avatarUrl !== undefined) {
      values.push(normalizeOptionalText(parse.data.avatarUrl));
      updates.push(`avatar_url = $${values.length}`);
    }
    if (parse.data.backsplashUrl !== undefined) {
      values.push(normalizeOptionalText(parse.data.backsplashUrl));
      updates.push(`backsplash_url = $${values.length}`);
    }
    if (parse.data.location !== undefined) {
      values.push(normalizeOptionalText(parse.data.location));
      updates.push(`location = $${values.length}`);
    }

    if (updates.length === 0) {
      return reply.send({ user: serializeUser(user) });
    }

    const changedFields = [
      parse.data.name !== undefined ? "name" : null,
      parse.data.bio !== undefined ? "bio" : null,
      parse.data.avatarUrl !== undefined ? "avatar" : null,
      parse.data.location !== undefined ? "location" : null,
    ].filter((field): field is "name" | "bio" | "avatar" | "location" => field !== null);

    values.push(user.id);
    const updated = await db.query<UserRow>(
      `UPDATE users
       SET ${updates.join(", ")}
       WHERE id = $${values.length}
       RETURNING id, email, name, role, bio, avatar_url AS "avatarUrl",
                 backsplash_url AS "backsplashUrl", location, password_hash AS "passwordHash"`,
      values
    );

    await insertEvent({
      eventId: randomUUID(),
      type: "profile.updated",
      occurredAt: new Date().toISOString(),
      payload: {
        userId: user.id,
        fields: changedFields,
      },
    });

    return reply.send({ user: serializeUser(updated.rows[0]) });
  });

  /** POST /api/auth/logout */
  app.post("/api/auth/logout", async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.header("Set-Cookie", buildExpiredSessionCookie());
    return reply.send({ ok: true });
  });
}
