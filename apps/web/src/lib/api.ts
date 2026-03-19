const API_BASE = "";

type ApiBadge = {
  id?: string;
  type: string;
  label: string;
  description: string;
  icon: string;
  priority: number;
  earned_at?: string;
};

type ApiNotification = {
  id: string;
  user_id?: string;
  type: string;
  title: string;
  body: string;
  reason_text: string | null;
  deep_link: string | null;
  is_read: boolean;
  is_bundled: boolean;
  bundle_count: number;
  created_at: string;
};

type ApiFundraiserSummary = {
  id: string;
  organizer_name: string;
  organizer_avatar: string | null;
  title: string;
  cover_image_url: string | null;
  goal_cents: number;
  raised_cents: number;
  category: string;
  location: string | null;
  is_urgent: boolean;
  donor_count: number;
  created_at: string;
};

type ApiRecommendation = {
  fundraiserId: string;
  score: number;
  reasons: Array<{ type: string; label: string }>;
  fundraiser: {
    title: string;
    coverImageUrl: string | null;
    goalCents: number;
    raisedCents: number;
    category: string;
    donorCount: number;
  };
};

type ApiFeedItem = {
  id: string;
  organizer_name: string;
  organizer_avatar: string | null;
  title: string;
  cover_image_url: string | null;
  goal_cents: number;
  raised_cents: number;
  category: string;
  location: string | null;
  is_urgent: boolean;
  donor_count: number;
  follower_count: number;
  created_at: string;
  updated_at: string;
  progress_percent: number | null;
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
  backsplashUrl: string | null;
  location: string | null;
};

export type Badge = {
  type: string;
  label: string;
  description: string;
  icon: string;
  priority: number;
  earnedAt?: string;
};

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  reasonText: string;
  deepLink: string;
  isRead: boolean;
  isBundled: boolean;
  bundleCount: number;
  createdAt: string;
};

export type FundraiserSummary = {
  id: string;
  organizerName: string;
  organizerAvatar: string | null;
  title: string;
  coverImageUrl: string | null;
  goalCents: number;
  raisedCents: number;
  category: string;
  location: string | null;
  isUrgent: boolean;
  donorCount: number;
  createdAt: string;
};

export type Recommendation = {
  fundraiserId: string;
  score: number;
  reasons: Array<{ type: string; label: string }>;
  fundraiser: {
    title: string;
    coverImageUrl: string | null;
    goalCents: number;
    raisedCents: number;
    category: string;
    donorCount: number;
  };
};

export type FeedItem = {
  id: string;
  organizerName: string;
  organizerAvatar: string | null;
  title: string;
  coverImageUrl: string | null;
  goalCents: number;
  raisedCents: number;
  category: string;
  location: string | null;
  isUrgent: boolean;
  donorCount: number;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
  progressPercent: number;
};

function mapBadge(badge: ApiBadge): Badge {
  return {
    type: badge.type,
    label: badge.label,
    description: badge.description,
    icon: badge.icon,
    priority: badge.priority,
    earnedAt: badge.earned_at,
  };
}

function mapNotification(notification: ApiNotification): AppNotification {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    reasonText: notification.reason_text ?? "",
    deepLink: notification.deep_link ?? "/notifications",
    isRead: notification.is_read,
    isBundled: notification.is_bundled,
    bundleCount: notification.bundle_count,
    createdAt: notification.created_at,
  };
}

function mapFundraiserSummary(fundraiser: ApiFundraiserSummary): FundraiserSummary {
  return {
    id: fundraiser.id,
    organizerName: fundraiser.organizer_name,
    organizerAvatar: fundraiser.organizer_avatar,
    title: fundraiser.title,
    coverImageUrl: fundraiser.cover_image_url,
    goalCents: fundraiser.goal_cents,
    raisedCents: fundraiser.raised_cents,
    category: fundraiser.category,
    location: fundraiser.location,
    isUrgent: fundraiser.is_urgent,
    donorCount: fundraiser.donor_count,
    createdAt: fundraiser.created_at,
  };
}

function mapRecommendation(recommendation: ApiRecommendation): Recommendation {
  return {
    fundraiserId: recommendation.fundraiserId,
    score: recommendation.score,
    reasons: recommendation.reasons,
    fundraiser: recommendation.fundraiser,
  };
}

function mapFeedItem(item: ApiFeedItem): FeedItem {
  return {
    id: item.id,
    organizerName: item.organizer_name,
    organizerAvatar: item.organizer_avatar,
    title: item.title,
    coverImageUrl: item.cover_image_url,
    goalCents: item.goal_cents,
    raisedCents: item.raised_cents,
    category: item.category,
    location: item.location,
    isUrgent: item.is_urgent,
    donorCount: item.donor_count,
    followerCount: item.follower_count,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    progressPercent: Number(item.progress_percent ?? 0),
  };
}

// ─── Fundraisers ─────────────────────────────────────────────────────────────
export function getFundraisers(params?: {
  cursor?: string;
  limit?: number;
  category?: string;
  sort?: string;
  search?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.category) qs.set("category", params.category);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.search) qs.set("search", params.search);
  return apiFetch<{ fundraisers: ApiFundraiserSummary[]; nextCursor: string | null }>(
    `/api/fundraisers?${qs}`
  ).then((payload) => ({
    fundraisers: payload.fundraisers.map(mapFundraiserSummary),
    nextCursor: payload.nextCursor,
  }));
}

export function getFundraiser(id: string) {
  return apiFetch<Record<string, unknown>>(`/api/fundraisers/${id}`);
}

export function publishFundraiser(data: {
  organizerId: string;
  title: string;
  summary: string;
  story: string;
  goalAmountCents: number;
  category: string;
  location: string;
  breakdown: string[];
  coverImageUrl?: string;
  distribution: {
    shareToCommunity: boolean;
    notifyFriends: boolean;
  };
}) {
  return apiFetch<{
    fundraiser: { id: string; title: string; status: string };
    distribution: { shareToCommunity: boolean; notifyFriends: boolean };
    shareUrl: string;
  }>("/api/fundraisers", {
    method: "POST",
    body: JSON.stringify(data),
  });
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
  return apiFetch<{ donationId: string; eventId: string; totalCents: number; autoFollowed: boolean }>(
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

// ─── Follows ─────────────────────────────────────────────────────────────────
export function getFollowStatus(params: {
  followerUserId: string;
  fundraiserId: string;
}) {
  const qs = new URLSearchParams({
    follower_id: params.followerUserId,
    fundraiser_id: params.fundraiserId,
  });
  return apiFetch<{ isFollowing: boolean }>(`/api/follows/status?${qs}`);
}

export function followFundraiser(data: {
  followerUserId: string;
  fundraiserId: string;
}) {
  return apiFetch<{ isFollowing: boolean; created: boolean }>("/api/follows", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function unfollowFundraiser(params: {
  followerUserId: string;
  fundraiserId: string;
}) {
  const qs = new URLSearchParams({
    follower_id: params.followerUserId,
    fundraiser_id: params.fundraiserId,
  });
  return apiFetch<{ isFollowing: boolean; removed: boolean }>(`/api/follows?${qs}`, {
    method: "DELETE",
  });
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
  return apiFetch<{ notifications: ApiNotification[]; nextCursor: string | null }>(
    `/api/notifications?${qs}`
  ).then((payload) => ({
    notifications: payload.notifications.map(mapNotification),
    nextCursor: payload.nextCursor,
  }));
}

export function markNotificationRead(id: string, userId: string) {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    body: JSON.stringify({ user_id: userId }),
  });
}

export function markAllNotificationsRead(userId: string) {
  return apiFetch<{ success: boolean }>("/api/notifications/mark-all-read", {
    method: "PATCH",
    body: JSON.stringify({ user_id: userId }),
  });
}

// ─── Recommendations ─────────────────────────────────────────────────────────
export function getRecommendations(userId: string, limit?: number) {
  const qs = new URLSearchParams({ user_id: userId });
  if (limit) qs.set("limit", String(limit));
  return apiFetch<{ recommendations: ApiRecommendation[]; meta: { mainSlots: number; explorationSlots: number } }>(
    `/api/recommendations?${qs}`
  ).then((payload) => ({
    recommendations: payload.recommendations.map(mapRecommendation),
    meta: payload.meta,
  }));
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
  return apiFetch<{ items: ApiFeedItem[]; nextCursor: string | null }>(
    `/api/feed?${qs}`
  ).then((payload) => ({
    items: payload.items.map(mapFeedItem),
    nextCursor: payload.nextCursor,
  }));
}

// ─── Badges ──────────────────────────────────────────────────────────────────
export function getBadges(userId: string) {
  return apiFetch<{ badges: ApiBadge[] }>(`/api/badges/${userId}`).then((payload) => ({
    badges: payload.badges.map(mapBadge),
  }));
}

export function evaluateBadges(userId: string) {
  return apiFetch<{ awarded: ApiBadge[]; eligible: string[] }>("/api/badges/evaluate", {
    method: "POST",
    body: JSON.stringify({ userId }),
  }).then((payload) => ({
    awarded: payload.awarded.map(mapBadge),
    eligible: payload.eligible,
  }));
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export function login(data: { email: string; password: string }) {
  return apiFetch<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerUser(data: {
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
}) {
  return apiFetch<{ user: AuthUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return apiFetch<{ user: AuthUser }>("/api/auth/me", { cache: "no-store" });
}

export function logout() {
  return apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export function updateProfile(data: {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  backsplashUrl?: string | null;
  location?: string | null;
}) {
  return apiFetch<{ user: AuthUser }>("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ─── Charities ───────────────────────────────────────────────────────────────
export function getCharityRequestEligibility(userId: string) {
  const qs = new URLSearchParams({ userId });
  return apiFetch<{ state: "eligible" | "under_review" | "active_community" }>(
    `/api/charities/requests/eligibility?${qs}`
  );
}

export function createCharityRequest(data: {
  userId: string;
  charityName: string;
  mission: string;
  beneficiaries: string;
  fundUsage: string;
  location: string;
  coverImageUrl?: string;
  idempotencyKey: string;
}) {
  return apiFetch<{
    id: string;
    status: "under_review" | "approved" | "rejected";
    decision_reason: string | null;
    charity_name: string;
  }>("/api/charities/requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMyCharityRequest(userId: string) {
  const qs = new URLSearchParams({ userId });
  return apiFetch<{
    id: string;
    status: "under_review" | "approved" | "rejected";
    decision_reason: string | null;
    charity_name: string;
    mission: string;
    beneficiaries: string;
    fund_usage: string;
    location: string;
    cover_image_url: string | null;
  }>(`/api/charities/requests/mine?${qs}`);
}

export function resubmitCharityRequest(
  requestId: string,
  data: {
    userId: string;
    charityName: string;
    mission: string;
    beneficiaries: string;
    fundUsage: string;
    location: string;
    coverImageUrl?: string;
  }
) {
  return apiFetch(`/api/charities/requests/${requestId}/resubmit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
