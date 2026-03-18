const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Fundraisers ─────────────────────────────────────────────────────────────
export function getFundraisers(params?: {
  cursor?: string;
  limit?: number;
  category?: string;
  sort?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.category) qs.set("category", params.category);
  if (params?.sort) qs.set("sort", params.sort);
  return apiFetch<{ fundraisers: unknown[]; nextCursor: string | null }>(
    `/api/fundraisers?${qs}`
  );
}

export function getFundraiser(id: string) {
  return apiFetch<Record<string, unknown>>(`/api/fundraisers/${id}`);
}

// ─── Donations ───────────────────────────────────────────────────────────────
export function createDonation(data: {
  fundraiserId: string;
  amountCents: number;
  tipCents: number;
  totalCents: number;
  tipPercent: number | "custom";
  isAnonymous: boolean;
  message: string | null;
  donorUserId: string | null;
}) {
  return apiFetch<{ donationId: string; eventId: string; totalCents: number }>(
    "/api/donations",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function getDonations(params: {
  fundraiserId: string;
  limit?: number;
  cursor?: string;
}) {
  const qs = new URLSearchParams({ fundraiserId: params.fundraiserId });
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  return apiFetch<{ donations: unknown[]; hasMore: boolean }>(
    `/api/donations?${qs}`
  );
}

// ─── Events ──────────────────────────────────────────────────────────────────
export function ingestEvent(event: {
  eventId: string;
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}) {
  return apiFetch("/api/events", { method: "POST", body: JSON.stringify(event) });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function getNotifications(params: {
  userId: string;
  tab?: string;
  limit?: number;
  cursor?: string;
}) {
  const qs = new URLSearchParams({ user_id: params.userId });
  if (params.tab) qs.set("tab", params.tab);
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  return apiFetch<{ notifications: unknown[]; nextCursor: string | null }>(
    `/api/notifications?${qs}`
  );
}

export function markNotificationRead(id: string, userId: string) {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    body: JSON.stringify({ user_id: userId }),
  });
}

// ─── Recommendations ─────────────────────────────────────────────────────────
export function getRecommendations(userId: string, limit?: number) {
  const qs = new URLSearchParams({ user_id: userId });
  if (limit) qs.set("limit", String(limit));
  return apiFetch<{ recommendations: unknown[] }>(`/api/recommendations?${qs}`);
}

// ─── Feed ────────────────────────────────────────────────────────────────────
export function getFeed(params?: {
  category?: string;
  sort?: string;
  cursor?: string;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));
  return apiFetch<{ items: unknown[]; nextCursor: string | null }>(
    `/api/feed?${qs}`
  );
}

// ─── Badges ──────────────────────────────────────────────────────────────────
export function getBadges(userId: string) {
  return apiFetch<{ badges: unknown[] }>(`/api/badges/${userId}`);
}

// ─── Charities ───────────────────────────────────────────────────────────────
export function createCharity(data: {
  organizerId: string;
  name: string;
  description: string;
  ein?: string;
  websiteUrl?: string;
  fundAllocation?: string;
  milestones: Array<{ amount: number; label: string }>;
}) {
  return apiFetch("/api/charities", { method: "POST", body: JSON.stringify(data) });
}
