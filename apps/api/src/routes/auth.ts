import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../db/client";

const SESSION_COOKIE_NAME = "gosupportme_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
  avatarUrl: string | null;
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
    `SELECT id, email, name, role, avatar_url AS "avatarUrl"
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/auth/login */
  app.post("/api/auth/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = LoginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { email, password } = parse.data;
    const devPassword = process.env.DEV_AUTH_PASSWORD ?? "gosupportme-dev-password";
    if (password !== devPassword) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    const userResult = await db.query<UserRow>(
      `SELECT id, email, name, role, avatar_url AS "avatarUrl"
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email]
    );
    const user = userResult.rows[0];
    if (!user) {
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

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  });

  /** GET /api/auth/me */
  app.get("/api/auth/me", async (request: FastifyRequest, reply: FastifyReply) => {
    const token = parseCookieValue(request.headers.cookie, SESSION_COOKIE_NAME);
    if (!token) {
      return reply.status(401).send({ error: "Not authenticated" });
    }

    try {
      const claims = await app.jwt.verify<SessionClaims>(token);
      const user = await getUserById(claims.sub);
      if (!user) {
        return reply.status(401).send({ error: "Not authenticated" });
      }

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch {
      return reply.status(401).send({ error: "Not authenticated" });
    }
  });

  /** POST /api/auth/logout */
  app.post("/api/auth/logout", async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.header("Set-Cookie", buildExpiredSessionCookie());
    return reply.send({ ok: true });
  });
}
