(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/meerkat-mascot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MeerkatMascot",
    ()=>MeerkatMascot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
;
const SIZE_CLASSES = {
    sm: "h-7 w-7",
    md: "h-10 w-10",
    lg: "h-14 w-14"
};
function MeerkatMascot({ size = "md", className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative inline-flex items-center justify-center ${SIZE_CLASSES[size]} ${className}`,
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "/mascot/mOS38-transparent.png",
            alt: "",
            fill: true,
            sizes: "56px",
            className: "object-contain"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/meerkat-mascot.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/meerkat-mascot.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = MeerkatMascot;
var _c;
__turbopack_context__.k.register(_c, "MeerkatMascot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCharityRequest",
    ()=>createCharityRequest,
    "createDonation",
    ()=>createDonation,
    "evaluateBadges",
    ()=>evaluateBadges,
    "followFundraiser",
    ()=>followFundraiser,
    "getBadges",
    ()=>getBadges,
    "getCharityRequestEligibility",
    ()=>getCharityRequestEligibility,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getDonations",
    ()=>getDonations,
    "getFeed",
    ()=>getFeed,
    "getFollowStatus",
    ()=>getFollowStatus,
    "getFundraiser",
    ()=>getFundraiser,
    "getFundraisers",
    ()=>getFundraisers,
    "getMyCharityRequest",
    ()=>getMyCharityRequest,
    "getNotifications",
    ()=>getNotifications,
    "getRecommendations",
    ()=>getRecommendations,
    "ingestEvent",
    ()=>ingestEvent,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "markAllNotificationsRead",
    ()=>markAllNotificationsRead,
    "markNotificationRead",
    ()=>markNotificationRead,
    "publishFundraiser",
    ()=>publishFundraiser,
    "registerUser",
    ()=>registerUser,
    "resubmitCharityRequest",
    ()=>resubmitCharityRequest,
    "unfollowFundraiser",
    ()=>unfollowFundraiser,
    "updateProfile",
    ()=>updateProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE = ("TURBOPACK compile-time value", "http://127.0.0.1:3101") ?? "http://localhost:3001";
async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({
                error: "Request failed"
            }));
        throw new Error(error.error ?? `HTTP ${res.status}`);
    }
    return res.json();
}
function mapBadge(badge) {
    return {
        type: badge.type,
        label: badge.label,
        description: badge.description,
        icon: badge.icon,
        priority: badge.priority,
        earnedAt: badge.earned_at
    };
}
function mapNotification(notification) {
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
        createdAt: notification.created_at
    };
}
function getFundraisers(params) {
    const qs = new URLSearchParams();
    if (params?.cursor) qs.set("cursor", params.cursor);
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.category) qs.set("category", params.category);
    if (params?.sort) qs.set("sort", params.sort);
    return apiFetch(`/api/fundraisers?${qs}`);
}
function getFundraiser(id) {
    return apiFetch(`/api/fundraisers/${id}`);
}
function publishFundraiser(data) {
    return apiFetch("/api/fundraisers", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
function createDonation(data) {
    return apiFetch("/api/donations", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
function getDonations(params) {
    const qs = new URLSearchParams({
        fundraiserId: params.fundraiserId
    });
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.cursor) qs.set("cursor", params.cursor);
    return apiFetch(`/api/donations?${qs}`);
}
function getFollowStatus(params) {
    const qs = new URLSearchParams({
        follower_id: params.followerUserId,
        fundraiser_id: params.fundraiserId
    });
    return apiFetch(`/api/follows/status?${qs}`);
}
function followFundraiser(data) {
    return apiFetch("/api/follows", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
function unfollowFundraiser(params) {
    const qs = new URLSearchParams({
        follower_id: params.followerUserId,
        fundraiser_id: params.fundraiserId
    });
    return apiFetch(`/api/follows?${qs}`, {
        method: "DELETE"
    });
}
function ingestEvent(event) {
    return apiFetch("/api/events", {
        method: "POST",
        body: JSON.stringify(event)
    });
}
function getNotifications(params) {
    const qs = new URLSearchParams({
        user_id: params.userId
    });
    if (params.tab) qs.set("tab", params.tab);
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.cursor) qs.set("cursor", params.cursor);
    return apiFetch(`/api/notifications?${qs}`).then((payload)=>({
            notifications: payload.notifications.map(mapNotification),
            nextCursor: payload.nextCursor
        }));
}
function markNotificationRead(id, userId) {
    return apiFetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        body: JSON.stringify({
            user_id: userId
        })
    });
}
function markAllNotificationsRead(userId) {
    return apiFetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        body: JSON.stringify({
            user_id: userId
        })
    });
}
function getRecommendations(userId, limit) {
    const qs = new URLSearchParams({
        user_id: userId
    });
    if (limit) qs.set("limit", String(limit));
    return apiFetch(`/api/recommendations?${qs}`);
}
function getFeed(params) {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.cursor) qs.set("cursor", params.cursor);
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch(`/api/feed?${qs}`);
}
function getBadges(userId) {
    return apiFetch(`/api/badges/${userId}`).then((payload)=>({
            badges: payload.badges.map(mapBadge)
        }));
}
function evaluateBadges(userId) {
    return apiFetch("/api/badges/evaluate", {
        method: "POST",
        body: JSON.stringify({
            userId
        })
    }).then((payload)=>({
            awarded: payload.awarded.map(mapBadge),
            eligible: payload.eligible
        }));
}
function login(data) {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
function registerUser(data) {
    return apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
function getCurrentUser() {
    return apiFetch("/api/auth/me", {
        cache: "no-store"
    });
}
function logout() {
    return apiFetch("/api/auth/logout", {
        method: "POST"
    });
}
function updateProfile(data) {
    return apiFetch("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
function getCharityRequestEligibility(userId) {
    const qs = new URLSearchParams({
        userId
    });
    return apiFetch(`/api/charities/requests/eligibility?${qs}`);
}
function createCharityRequest(data) {
    return apiFetch("/api/charities/requests", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
function getMyCharityRequest(userId) {
    const qs = new URLSearchParams({
        userId
    });
    return apiFetch(`/api/charities/requests/mine?${qs}`);
}
function resubmitCharityRequest(requestId, data) {
    return apiFetch(`/api/charities/requests/${requestId}/resubmit`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/seed-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SEED_COMMUNITIES",
    ()=>SEED_COMMUNITIES,
    "SEED_FAVORITES",
    ()=>SEED_FAVORITES,
    "SEED_FUNDRAISERS",
    ()=>SEED_FUNDRAISERS,
    "SEED_NETWORK_POSTS",
    ()=>SEED_NETWORK_POSTS,
    "SEED_NOTIFICATIONS",
    ()=>SEED_NOTIFICATIONS,
    "SEED_USERS",
    ()=>SEED_USERS,
    "formatCents",
    ()=>formatCents,
    "formatCentsExact",
    ()=>formatCentsExact,
    "timeAgo",
    ()=>timeAgo
]);
const SEED_USERS = [
    {
        id: "a1b2c3d4-0001-0001-0001-000000000001",
        name: "Sarah Johnson",
        bio: "Community organizer and advocate for 15+ years. Passionate about connecting neighbors in need.",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        location: "San Francisco, CA",
        role: "organizer",
        amountRaised: 1275000,
        followerCount: 142,
        fundraiserCount: 5,
        donationCount: 89
    },
    {
        id: "a1b2c3d4-0002-0002-0002-000000000002",
        name: "Michael Chen",
        bio: "Proud supporter of local causes.",
        avatarUrl: "https://i.pravatar.cc/150?img=2",
        location: "Oakland, CA",
        role: "donor",
        amountRaised: 0,
        followerCount: 8,
        fundraiserCount: 0,
        donationCount: 23
    },
    {
        id: "a1b2c3d4-0003-0003-0003-000000000003",
        name: "Jessica Rivera",
        bio: "Social worker and fundraising champion.",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
        location: "Berkeley, CA",
        role: "organizer",
        amountRaised: 498000,
        followerCount: 67,
        fundraiserCount: 3,
        donationCount: 45
    },
    {
        id: "a1b2c3d4-0005-0005-0005-000000000005",
        name: "Junisha Bhorman",
        bio: "Passionate about education and community resilience. I believe every child deserves a fair start.",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        location: "Los Angeles, CA",
        role: "organizer",
        amountRaised: 1752000,
        followerCount: 345,
        fundraiserCount: 8,
        donationCount: 162
    }
];
const SEED_COMMUNITIES = [
    {
        id: "c1",
        name: "Bay Area Community Support",
        slug: "bay-area-community-support",
        description: "Neighbors helping neighbors through life's challenges.",
        memberCount: 2647,
        coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop"
    },
    {
        id: "c2",
        name: "Education Access Network",
        slug: "education-access-network",
        description: "Supporting schools, students, and community learning programs.",
        memberCount: 1982,
        coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop"
    },
    {
        id: "c3",
        name: "Local Disaster Relief Circle",
        slug: "local-disaster-relief-circle",
        description: "Rapid response support during fires, floods, and severe weather.",
        memberCount: 3105,
        coverImageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop"
    }
];
const SEED_FUNDRAISERS = [
    {
        id: "b1b2c3d4-0001-0001-0001-000000000001",
        communityId: "c1",
        organizerId: "a1b2c3d4-0001-0001-0001-000000000001",
        organizerName: "Sarah Johnson",
        organizerAvatar: "https://i.pravatar.cc/150?img=1",
        title: "Help the Martinez Family Rebuild After the Fire",
        story: `On the evening of March 2nd, the Martinez family lost their home to an unexpected electrical fire. Carlos, Maria, and their three children—ages 4, 7 and 12—escaped with only the clothes on their backs. The fire destroyed everything: their belongings, photos, important documents, and the home they had lived in for over 15 years.

The family is currently staying with relatives while they figure out their next steps. Carlos serves as a mechanical in Atlanta in a teaching assistant at the local elementary school. They are hardworking, loving parents who have always been there for their community.

Your support will help the Martinez family secure temporary housing, replace essential items, and begin the long process of rebuilding their lives. Every dollar makes a difference. Please donate and share their story.`,
        coverImageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop",
        goalCents: 5000000,
        raisedCents: 2845000,
        category: "Emergency",
        location: "Atlanta, GA",
        isUrgent: true,
        donorCount: 847,
        followerCount: 234,
        createdAt: "2024-03-01T10:00:00Z",
        progressPercent: 57
    },
    {
        id: "b1b2c3d4-0002-0002-0002-000000000002",
        communityId: null,
        organizerId: "a1b2c3d4-0003-0003-0003-000000000003",
        organizerName: "Jessica Rivera",
        organizerAvatar: "https://i.pravatar.cc/150?img=3",
        title: "Support Donna's Cancer Treatment Journey",
        story: `Donna was diagnosed with stage 3 breast cancer last month. She is a single mother of two who works tirelessly as a nurse. Medical bills are mounting and she needs our support to focus on recovery.

Donna has dedicated her life to caring for others as a nurse for 12 years. Now it's our turn to care for her. Funds will cover chemotherapy co-pays, medication costs, childcare during treatment, and living expenses during recovery.

Please help Donna fight back.`,
        coverImageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
        goalCents: 8000000,
        raisedCents: 9855000,
        category: "Medical",
        location: "Chicago, IL",
        isUrgent: false,
        donorCount: 1203,
        followerCount: 567,
        createdAt: "2024-02-15T10:00:00Z",
        progressPercent: 123
    },
    {
        id: "b1b2c3d4-0003-0003-0003-000000000003",
        communityId: "c2",
        organizerId: "a1b2c3d4-0005-0005-0005-000000000005",
        organizerName: "Junisha Bhorman",
        organizerAvatar: "https://i.pravatar.cc/150?img=5",
        title: "New Playground for Lincoln Elementary",
        story: `Lincoln Elementary's playground equipment is over 20 years old and has become unsafe for our children. Several pieces have been removed due to safety concerns, leaving kids with very little space to play and exercise.

We are raising funds to build a brand new, inclusive playground that every child—including those with disabilities—can enjoy. The new playground will include accessible swings, climbing structures, sensory play elements, and shaded seating for parents.

Your donation directly invests in our community's children.`,
        coverImageUrl: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&auto=format&fit=crop",
        goalCents: 3500000,
        raisedCents: 857500,
        category: "Education",
        location: "Los Angeles, CA",
        isUrgent: false,
        donorCount: 214,
        followerCount: 89,
        createdAt: "2024-03-10T10:00:00Z",
        progressPercent: 25
    },
    {
        id: "b1b2c3d4-0004-0004-0004-000000000004",
        communityId: "c3",
        organizerId: "a1b2c3d4-0001-0001-0001-000000000001",
        organizerName: "Sarah Johnson",
        organizerAvatar: "https://i.pravatar.cc/150?img=1",
        title: "Help Rebuild After the Storm",
        story: `Our neighborhood was devastated by flooding last week. Dozens of families are displaced and need immediate assistance with food, shelter, and rebuilding costs. What started as heavy rain turned into a flash flood that swept through our community in minutes.

Funds will be distributed to affected families through our established neighborhood association, which has been serving the community for 20 years. We are transparent about every dollar spent and will post regular updates.`,
        coverImageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
        goalCents: 10000000,
        raisedCents: 11062000,
        category: "Emergency",
        location: "Houston, TX",
        isUrgent: true,
        donorCount: 2847,
        followerCount: 1203,
        createdAt: "2024-01-20T10:00:00Z",
        progressPercent: 110
    },
    {
        id: "b1b2c3d4-0005-0005-0005-000000000005",
        communityId: "c1",
        organizerId: "a1b2c3d4-0003-0003-0003-000000000003",
        organizerName: "Jessica Rivera",
        organizerAvatar: "https://i.pravatar.cc/150?img=3",
        title: "Build a Community Garden",
        story: `We want to transform an unused lot into a thriving community garden that provides fresh produce for local families and a gathering place for neighbors. Over 40% of our neighborhood is classified as a food desert.

The garden will feature 30 individual plots for community members, communal herb and vegetable sections, composting facilities, and educational programming for youth.`,
        coverImageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
        goalCents: 1500000,
        raisedCents: 3976000,
        category: "Community",
        location: "Portland, OR",
        isUrgent: false,
        donorCount: 891,
        followerCount: 445,
        createdAt: "2024-02-01T10:00:00Z",
        progressPercent: 100
    },
    {
        id: "b1b2c3d4-0007-0007-0007-000000000007",
        communityId: "c2",
        organizerId: "a1b2c3d4-0001-0001-0001-000000000001",
        organizerName: "Sarah Johnson",
        organizerAvatar: "https://i.pravatar.cc/150?img=1",
        title: "Send Underserved Kids to Coding Camp",
        story: `Help us send 50 kids from underserved communities to a week-long coding bootcamp this summer. 75% of our applicants come from households earning less than $40k/year. Technology skills are the gateway to economic mobility.

Funds cover tuition, transportation, meals, and a laptop to keep after camp.`,
        coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
        goalCents: 2500000,
        raisedCents: 8856000,
        category: "Education",
        location: "San Francisco, CA",
        isUrgent: false,
        donorCount: 1876,
        followerCount: 892,
        createdAt: "2024-01-05T10:00:00Z",
        progressPercent: 100
    },
    {
        id: "b1b2c3d4-0008-0008-0008-000000000008",
        communityId: null,
        organizerId: "a1b2c3d4-0003-0003-0003-000000000003",
        organizerName: "Jessica Rivera",
        organizerAvatar: "https://i.pravatar.cc/150?img=3",
        title: "Save the Paws Animal Shelter from Closing",
        story: `Our local no-kill shelter has saved over 5,000 animals in the past decade. Due to funding cuts from the city, we are at risk of closing our doors permanently. Every animal in our care would need to be transferred or face euthanasia.

We need to raise operating costs for the next 6 months while we secure long-term funding partnerships.`,
        coverImageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop",
        goalCents: 6000000,
        raisedCents: 9179000,
        category: "Animals",
        location: "Denver, CO",
        isUrgent: true,
        donorCount: 2341,
        followerCount: 1567,
        createdAt: "2024-02-20T10:00:00Z",
        progressPercent: 100
    },
    {
        id: "b1b2c3d4-0009-0009-0009-000000000009",
        communityId: null,
        organizerId: "a1b2c3d4-0005-0005-0005-000000000005",
        organizerName: "Junisha Bhorman",
        organizerAvatar: "https://i.pravatar.cc/150?img=5",
        title: "Help a Little Boy Get a Life-Saving Heart Surgery",
        story: `Eight-year-old Eli was born with a congenital heart defect that requires open heart surgery. His parents, both teachers, have exhausted their savings. Insurance only covers 60% of the $250,000 procedure.

Without surgery, Eli's doctors say he has less than a year. Please help give Eli a chance at a full life.`,
        coverImageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop",
        goalCents: 15000000,
        raisedCents: 8837000,
        category: "Medical",
        location: "Boston, MA",
        isUrgent: true,
        donorCount: 1120,
        followerCount: 678,
        createdAt: "2024-03-05T10:00:00Z",
        progressPercent: 59
    },
    {
        id: "b1b2c3d4-0010-0010-0010-000000000010",
        communityId: "c3",
        organizerId: "a1b2c3d4-0001-0001-0001-000000000001",
        organizerName: "Sarah Johnson",
        organizerAvatar: "https://i.pravatar.cc/150?img=1",
        title: "College Fund for Displaced Students",
        story: `Students who lost their homes in the wildfire now face losing their education too. Three students had to withdraw from college when their families became homeless. Help us keep their college dreams alive with emergency scholarships.`,
        coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
        goalCents: 4000000,
        raisedCents: 4068000,
        category: "Education",
        location: "Santa Barbara, CA",
        isUrgent: false,
        donorCount: 567,
        followerCount: 234,
        createdAt: "2024-02-10T10:00:00Z",
        progressPercent: 100
    }
];
const SEED_NOTIFICATIONS = [
    {
        id: "n1",
        userId: "a1b2c3d4-0001-0001-0001-000000000001",
        type: "fundraiser_milestone",
        title: "Wildfire Safety Alerts fundraiser reached 75% of its goal!",
        body: "Your fundraiser is gaining momentum. Keep sharing!",
        reasonText: "You are the organizer of this fundraiser",
        deepLink: "/fundraiser/b1b2c3d4-0001-0001-0001-000000000001",
        isRead: false,
        isBundled: false,
        bundleCount: 1,
        createdAt: "2024-03-15T10:00:00Z"
    },
    {
        id: "n2",
        userId: "a1b2c3d4-0001-0001-0001-000000000001",
        type: "fundraiser_update",
        title: "Maya posted a new update: 'Surgery went well!'",
        body: "The surgery was a success! Donna is recovering well.",
        reasonText: "Because you follow this fundraiser",
        deepLink: "/fundraiser/b1b2c3d4-0002-0002-0002-000000000002",
        isRead: false,
        isBundled: false,
        bundleCount: 1,
        createdAt: "2024-03-14T16:00:00Z"
    },
    {
        id: "n3",
        userId: "a1b2c3d4-0001-0001-0001-000000000001",
        type: "fundraiser_milestone",
        title: "Lakewood Elementary fundraiser is fully funded!",
        body: "The fundraiser reached its goal thanks to 214 donors.",
        reasonText: "Because you donated to this fundraiser",
        deepLink: "/fundraiser/b1b2c3d4-0003-0003-0003-000000000003",
        isRead: true,
        isBundled: false,
        bundleCount: 1,
        createdAt: "2024-03-13T12:00:00Z"
    },
    {
        id: "n4",
        userId: "a1b2c3d4-0001-0001-0001-000000000001",
        type: "donation_received",
        title: "Your recurring donation of $23 will process tomorrow",
        body: "Making a difference, one donation at a time.",
        reasonText: "Scheduled donation reminder",
        deepLink: "/profile/a1b2c3d4-0001-0001-0001-000000000001",
        isRead: true,
        isBundled: false,
        bundleCount: 1,
        createdAt: "2024-03-12T08:00:00Z"
    },
    {
        id: "n5",
        userId: "a1b2c3d4-0001-0001-0001-000000000001",
        type: "community_activity",
        title: "Watch Duty community: 3 new fundraisers this week.",
        body: "Emergency relief fundraisers are trending in your area.",
        reasonText: "Because you are in the Watch Duty community",
        deepLink: "/community",
        isRead: true,
        isBundled: false,
        bundleCount: 1,
        createdAt: "2024-03-11T14:00:00Z"
    },
    {
        id: "n6",
        userId: "a1b2c3d4-0001-0001-0001-000000000001",
        type: "community_activity",
        title: "The organizer of Austin Flood Victims thanked supporters",
        body: "Read their heartfelt message.",
        reasonText: "Because you donated",
        deepLink: "/fundraiser/b1b2c3d4-0004-0004-0004-000000000004",
        isRead: true,
        isBundled: false,
        bundleCount: 1,
        createdAt: "2024-03-10T10:00:00Z"
    }
];
const SEED_NETWORK_POSTS = [
    {
        id: "p1",
        authorId: "a1b2c3d4-0001-0001-0001-000000000001",
        fundraiserId: "b1b2c3d4-0004-0004-0004-000000000004",
        content: "We secured temporary shelter for 12 families this week. Thank you for continuing to share and support.",
        createdAt: "2026-03-17T18:40:00Z"
    },
    {
        id: "p2",
        authorId: "a1b2c3d4-0003-0003-0003-000000000003",
        fundraiserId: "b1b2c3d4-0002-0002-0002-000000000002",
        content: "Donna completed another treatment round today. Community support is making this possible.",
        createdAt: "2026-03-18T14:10:00Z"
    },
    {
        id: "p3",
        authorId: "a1b2c3d4-0005-0005-0005-000000000005",
        fundraiserId: "b1b2c3d4-0003-0003-0003-000000000003",
        content: "Construction plans are approved and playground installation starts next month!",
        createdAt: "2026-03-18T08:25:00Z"
    },
    {
        id: "p4",
        authorId: "a1b2c3d4-0001-0001-0001-000000000001",
        fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
        content: "The Martinez family moved into stable housing today. Your help changed everything.",
        createdAt: "2026-03-16T21:05:00Z"
    }
];
const SEED_FAVORITES = [
    {
        id: "fav-1",
        userId: "a1b2c3d4-0002-0002-0002-000000000002",
        fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
        createdAt: "2026-03-15T09:00:00Z"
    },
    {
        id: "fav-2",
        userId: "a1b2c3d4-0002-0002-0002-000000000002",
        fundraiserId: "b1b2c3d4-0003-0003-0003-000000000003",
        createdAt: "2026-03-16T10:20:00Z"
    },
    {
        id: "fav-3",
        userId: "a1b2c3d4-0002-0002-0002-000000000002",
        fundraiserId: "b1b2c3d4-0008-0008-0008-000000000008",
        createdAt: "2026-03-17T07:45:00Z"
    },
    {
        id: "fav-4",
        userId: "a1b2c3d4-0002-0002-0002-000000000002",
        fundraiserId: "b1b2c3d4-0009-0009-0009-000000000009",
        createdAt: "2026-03-17T20:15:00Z"
    }
];
function formatCents(cents) {
    if (cents >= 100000) {
        return `$${(cents / 100000).toFixed(0)}k`;
    }
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(cents / 100);
}
function formatCentsExact(cents) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(cents / 100);
}
function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/client-events.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_DATA_REFRESH_EVENT",
    ()=>APP_DATA_REFRESH_EVENT,
    "emitAppDataRefresh",
    ()=>emitAppDataRefresh
]);
const APP_DATA_REFRESH_EVENT = "gosupportme:data-refresh";
function emitAppDataRefresh() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.dispatchEvent(new Event(APP_DATA_REFRESH_EVENT));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$meerkat$2d$mascot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/meerkat-mascot.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/seed-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$client$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/client-events.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const NAV_DROPDOWN_LIMIT = 4;
const FAVORITES_PREVIEW_LIMIT = 3;
const CURRENT_USER_ID = "a1b2c3d4-0002-0002-0002-000000000002";
function Navbar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [searchValue, setSearchValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isNotificationsOpen, setIsNotificationsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recentNotifications, setRecentNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const notificationsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const favoritesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const createMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const profileMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const unreadCount = recentNotifications.filter((notification)=>!notification.isRead).length;
    const previewNotifications = recentNotifications.slice(0, NAV_DROPDOWN_LIMIT);
    const favoriteFundraisers = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEED_FAVORITES"].filter((favorite)=>favorite.userId === CURRENT_USER_ID).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((favorite)=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEED_FUNDRAISERS"].find((fundraiser)=>fundraiser.id === favorite.fundraiserId)).filter((fundraiser)=>fundraiser !== undefined).slice(0, FAVORITES_PREVIEW_LIMIT);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            function handleClickOutside(event) {
                if (!notificationsRef.current?.contains(event.target)) {
                    setIsNotificationsOpen(false);
                }
                if (!favoritesRef.current?.contains(event.target)) {
                    setIsFavoritesOpen(false);
                }
                if (!createMenuRef.current?.contains(event.target)) {
                    setIsCreateMenuOpen(false);
                }
                if (!profileMenuRef.current?.contains(event.target)) {
                    setIsProfileMenuOpen(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "Navbar.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            let isMounted = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])().then({
                "Navbar.useEffect": (response)=>{
                    if (isMounted) {
                        setCurrentUser(response.user);
                    }
                }
            }["Navbar.useEffect"]).catch({
                "Navbar.useEffect": ()=>{
                    if (isMounted) {
                        setCurrentUser(null);
                    }
                }
            }["Navbar.useEffect"]);
            return ({
                "Navbar.useEffect": ()=>{
                    isMounted = false;
                }
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], [
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            let cancelled = false;
            async function loadNotifications(userId) {
                try {
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotifications"])({
                        userId,
                        limit: 20
                    });
                    if (!cancelled) {
                        setRecentNotifications(result.notifications);
                    }
                } catch  {
                    if (!cancelled) {
                        setRecentNotifications([]);
                    }
                }
            }
            if (!currentUser) {
                setRecentNotifications([]);
                return;
            }
            void loadNotifications(currentUser.id);
            const onRefresh = {
                "Navbar.useEffect.onRefresh": ()=>{
                    void loadNotifications(currentUser.id);
                }
            }["Navbar.useEffect.onRefresh"];
            window.addEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$client$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["APP_DATA_REFRESH_EVENT"], onRefresh);
            return ({
                "Navbar.useEffect": ()=>{
                    cancelled = true;
                    window.removeEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$client$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["APP_DATA_REFRESH_EVENT"], onRefresh);
                }
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], [
        currentUser,
        pathname
    ]);
    async function handleLogout() {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])();
            setCurrentUser(null);
            router.push("/sign-in");
            router.refresh();
        } finally{
            setIsLoggingOut(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 bg-white border-b border-border-light",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 h-14 flex items-center gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "flex items-center gap-1 flex-shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$meerkat$2d$mascot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeerkatMascot"], {
                            size: "sm",
                            className: "h-8 w-8"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-text-primary text-base hidden sm:block",
                            children: "GoSupportMe"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 max-w-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted",
                                width: "14",
                                height: "14",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "11",
                                        cy: "11",
                                        r: "8"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "m21 21-4.35-4.35"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search fundraisers...",
                                value: searchValue,
                                onChange: (e)=>setSearchValue(e.target.value),
                                className: "w-full pl-9 pr-3 py-1.5 text-sm bg-bg-gray border border-border-light rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text-primary placeholder:text-text-muted"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "hidden md:flex items-center gap-4 ml-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-sm text-text-secondary hover:text-text-primary transition-colors",
                            children: "Discover"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/community",
                            className: "text-sm text-text-secondary hover:text-text-primary transition-colors",
                            children: "Communities"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            ref: createMenuRef,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "border border-border-medium bg-white text-text-primary text-sm font-semibold px-4 py-2 rounded-md hover:border-primary hover:text-primary hover:bg-bg-faint transition-colors whitespace-nowrap inline-flex items-center gap-1.5",
                                    "aria-label": isCreateMenuOpen ? "Close create menu" : "Open create menu",
                                    "aria-expanded": isCreateMenuOpen,
                                    onClick: ()=>setIsCreateMenuOpen((open)=>!open),
                                    children: "Create +"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                isCreateMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute right-0 mt-2 w-56 rounded-lg border border-border-light bg-white shadow-lg p-1.5 z-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/fundraiser/new?source=primary_cta",
                                            className: "block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors",
                                            onClick: ()=>setIsCreateMenuOpen(false),
                                            children: "Create fundraiser"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 196,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/charity/new?source=primary_cta",
                                            className: "block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors",
                                            onClick: ()=>setIsCreateMenuOpen(false),
                                            children: "Create charity"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                    lineNumber: 195,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    ref: favoritesRef,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-faint transition-colors",
                                            "aria-label": isFavoritesOpen ? "Close favorites preview" : "Open favorites preview",
                                            "aria-expanded": isFavoritesOpen,
                                            onClick: ()=>setIsFavoritesOpen((open)=>!open),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "24",
                                                height: "24",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                lineNumber: 222,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this),
                                        isFavoritesOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-primary/20 bg-white shadow-[0_12px_30px_rgba(0,185,100,0.12)] p-2 z-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between rounded-lg px-2.5 py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-semibold text-text-primary",
                                                            children: "Favorites"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/favorites",
                                                            className: "text-xs text-primary font-medium hover:underline",
                                                            onClick: ()=>setIsFavoritesOpen(false),
                                                            children: "View All"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-80 overflow-y-auto",
                                                    children: [
                                                        favoriteFundraisers.map((fundraiser)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/fundraiser/${fundraiser.id}`,
                                                                className: "block rounded-md px-2 py-2 hover:bg-primary/5 transition-colors",
                                                                onClick: ()=>setIsFavoritesOpen(false),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-medium text-text-primary line-clamp-1",
                                                                        children: fundraiser.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                                        lineNumber: 247,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-text-secondary mt-0.5",
                                                                        children: [
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCents"])(fundraiser.raisedCents),
                                                                            " raised"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                                        lineNumber: 250,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, fundraiser.id, true, {
                                                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                                lineNumber: 241,
                                                                columnNumber: 23
                                                            }, this)),
                                                        favoriteFundraisers.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mx-1 mt-1 rounded-md bg-bg-faint px-2 py-3 text-xs text-text-muted",
                                                            children: "No favorites yet."
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 228,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    ref: notificationsRef,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-faint transition-colors",
                                            "aria-label": isNotificationsOpen ? "Close notification preview" : "Open notification preview",
                                            "aria-expanded": isNotificationsOpen,
                                            onClick: ()=>setIsNotificationsOpen((open)=>!open),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M4 4h16v12H5.17L4 17.17V4z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "m4 6 8 6 8-6"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 19
                                                }, this),
                                                unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-4 text-center",
                                                    children: unreadCount > 9 ? "9+" : unreadCount
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, this),
                                        isNotificationsOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-primary/20 bg-white shadow-[0_14px_32px_rgba(16,24,40,0.16)] p-2 z-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between rounded-lg px-2.5 py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-semibold text-text-primary",
                                                            children: "Notifications"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 286,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/notifications",
                                                            className: "text-xs text-primary font-medium hover:underline",
                                                            onClick: ()=>setIsNotificationsOpen(false),
                                                            children: "View all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-80 overflow-y-auto",
                                                    children: recentNotifications.length > 0 ? previewNotifications.map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: notification.deepLink,
                                                            className: "block rounded-md px-2 py-2 transition-colors hover:bg-primary/5",
                                                            onClick: ()=>setIsNotificationsOpen(false),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-text-primary line-clamp-1",
                                                                    children: notification.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                                    lineNumber: 304,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-text-secondary mt-0.5 line-clamp-1",
                                                                    children: notification.body
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                                    lineNumber: 307,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[11px] text-text-muted mt-1",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeAgo"])(notification.createdAt)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                                    lineNumber: 310,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, notification.id, true, {
                                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                            lineNumber: 298,
                                                            columnNumber: 25
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mx-1 mt-1 rounded-md bg-bg-faint px-2 py-3 text-xs text-text-muted",
                                                        children: "No notifications yet."
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-1 pl-3 border-l border-border-light flex items-center",
                            ref: profileMenuRef,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setIsProfileMenuOpen((open)=>!open),
                                        className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-light overflow-hidden bg-bg-gray",
                                        "aria-label": isProfileMenuOpen ? "Close profile menu" : "Open profile menu",
                                        "aria-expanded": isProfileMenuOpen,
                                        title: currentUser.name,
                                        children: currentUser.avatarUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: currentUser.avatarUrl,
                                            alt: currentUser.name,
                                            width: 36,
                                            height: 36,
                                            className: "h-full w-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 337,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-semibold text-text-primary",
                                            children: currentUser.name.charAt(0).toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                                            lineNumber: 345,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                        lineNumber: 328,
                                        columnNumber: 17
                                    }, this),
                                    isProfileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-0 mt-2 w-44 rounded-lg border border-border-light bg-white shadow-lg p-1.5 z-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/profile/${currentUser.id}`,
                                                className: "block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors",
                                                onClick: ()=>setIsProfileMenuOpen(false),
                                                children: "Profile"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                lineNumber: 352,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setIsProfileMenuOpen(false);
                                                    void handleLogout();
                                                },
                                                disabled: isLoggingOut,
                                                className: "w-full text-left rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-faint transition-colors disabled:opacity-60",
                                                children: isLoggingOut ? "Signing out..." : "Log out"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                                lineNumber: 359,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                                        lineNumber: 351,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                lineNumber: 327,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 326,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/sign-in",
                            className: "text-sm text-text-secondary hover:text-text-primary transition-colors",
                            children: "Sign in"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/navbar.tsx",
                            lineNumber: 375,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "md:hidden ml-auto p-2 text-text-secondary hover:text-text-primary",
                    "aria-label": "Menu",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "3",
                                y1: "6",
                                x2: "21",
                                y2: "6"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "3",
                                y1: "12",
                                x2: "21",
                                y2: "12"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                lineNumber: 391,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "3",
                                y1: "18",
                                x2: "21",
                                y2: "18"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/navbar.tsx",
                                lineNumber: 392,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/navbar.tsx",
                        lineNumber: 389,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/navbar.tsx",
                    lineNumber: 385,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/navbar.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/navbar.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
_s(Navbar, "7DpgZG0JrrcY2udmzksK6wB+tzo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/providers/toast-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const CONFETTI_PIECES = Array.from({
    length: 28
}, (_, index)=>index);
const CONFETTI_COLORS = [
    "#00B964",
    "#22C55E",
    "#FACC15",
    "#FB7185",
    "#60A5FA",
    "#A78BFA"
];
function CelebrationConfetti({ toastId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 overflow-hidden",
        children: CONFETTI_PIECES.map((piece)=>{
            const left = 8 + (piece * 83 + toastId) % 84;
            const size = 6 + piece % 4;
            const delay = piece * 28;
            const duration = 1100 + piece % 5 * 140;
            const translateX = (piece % 7 - 3) * 28;
            const rotate = (piece % 2 === 0 ? 1 : -1) * (80 + piece * 11);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute -top-6 rounded-sm opacity-0",
                style: {
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size * 1.6}px`,
                    backgroundColor: CONFETTI_COLORS[piece % CONFETTI_COLORS.length],
                    animation: `toast-confetti-burst ${duration}ms ease-out ${delay}ms forwards`,
                    transform: `translate3d(0, 0, 0) rotate(0deg)`,
                    ["--confetti-x"]: `${translateX}px`,
                    ["--confetti-y"]: `${170 + piece * 10}px`,
                    ["--confetti-r"]: `${rotate}deg`
                }
            }, piece, false, {
                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                lineNumber: 32,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = CelebrationConfetti;
function ToastProvider({ children }) {
    _s();
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const celebrationToast = toasts.find((toast)=>toast.variant === "celebration");
    const stackedToasts = toasts.filter((toast)=>toast.variant !== "celebration");
    const dismissToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[dismissToast]": (id)=>{
            setToasts({
                "ToastProvider.useCallback[dismissToast]": (current)=>current.filter({
                        "ToastProvider.useCallback[dismissToast]": (toast)=>toast.id !== id
                    }["ToastProvider.useCallback[dismissToast]"])
            }["ToastProvider.useCallback[dismissToast]"]);
        }
    }["ToastProvider.useCallback[dismissToast]"], []);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[showToast]": (toast)=>{
            const id = Date.now() + Math.floor(Math.random() * 1000);
            setToasts({
                "ToastProvider.useCallback[showToast]": (current)=>[
                        ...current,
                        {
                            id,
                            ...toast
                        }
                    ]
            }["ToastProvider.useCallback[showToast]"]);
        }
    }["ToastProvider.useCallback[showToast]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToastProvider.useEffect": ()=>{
            if (stackedToasts.length === 0) return;
            const timeoutId = window.setTimeout({
                "ToastProvider.useEffect.timeoutId": ()=>{
                    dismissToast(stackedToasts[0].id);
                }
            }["ToastProvider.useEffect.timeoutId"], 4500);
            return ({
                "ToastProvider.useEffect": ()=>window.clearTimeout(timeoutId)
            })["ToastProvider.useEffect"];
        }
    }["ToastProvider.useEffect"], [
        dismissToast,
        stackedToasts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToastProvider.useEffect": ()=>{
            if (!celebrationToast) return;
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            const onKeyDown = {
                "ToastProvider.useEffect.onKeyDown": (event)=>{
                    if (event.key === "Escape") {
                        dismissToast(celebrationToast.id);
                    }
                }
            }["ToastProvider.useEffect.onKeyDown"];
            document.addEventListener("keydown", onKeyDown);
            return ({
                "ToastProvider.useEffect": ()=>{
                    document.body.style.overflow = previousOverflow;
                    document.removeEventListener("keydown", onKeyDown);
                }
            })["ToastProvider.useEffect"];
        }
    }["ToastProvider.useEffect"], [
        celebrationToast,
        dismissToast
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToastProvider.useMemo[value]": ()=>({
                showToast
            })
    }["ToastProvider.useMemo[value]"], [
        showToast
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: value,
        children: [
            children,
            celebrationToast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e6f97bb1f2314580" + " " + "fixed inset-0 z-[110] flex items-center justify-center px-4 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>dismissToast(celebrationToast.id),
                        className: "jsx-e6f97bb1f2314580" + " " + "absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "dialog",
                        "aria-modal": "true",
                        "aria-labelledby": `celebration-title-${celebrationToast.id}`,
                        className: "jsx-e6f97bb1f2314580" + " " + "relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-white px-6 pb-6 pt-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.35)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CelebrationConfetti, {
                                toastId: celebrationToast.id
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e6f97bb1f2314580" + " " + "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e6f97bb1f2314580" + " " + "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "28",
                                            height: "28",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            className: "jsx-e6f97bb1f2314580",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M8 21h8",
                                                    className: "jsx-e6f97bb1f2314580"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 17v4",
                                                    className: "jsx-e6f97bb1f2314580"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                    lineNumber: 119,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M7 4h10v5a5 5 0 0 1-10 0V4Z",
                                                    className: "jsx-e6f97bb1f2314580"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M17 5h3v2a4 4 0 0 1-4 4h-1",
                                                    className: "jsx-e6f97bb1f2314580"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M7 5H4v2a4 4 0 0 0 4 4h1",
                                                    className: "jsx-e6f97bb1f2314580"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                            lineNumber: 117,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-e6f97bb1f2314580" + " " + "mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-primary",
                                        children: "Achievement unlocked"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                        lineNumber: 125,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: `celebration-title-${celebrationToast.id}`,
                                        className: "jsx-e6f97bb1f2314580" + " " + "mt-2 text-2xl font-bold text-text-primary",
                                        children: celebrationToast.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this),
                                    celebrationToast.description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-e6f97bb1f2314580" + " " + "mt-3 text-sm leading-relaxed text-text-secondary",
                                        children: celebrationToast.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                        lineNumber: 135,
                                        columnNumber: 17
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>dismissToast(celebrationToast.id),
                                        className: "jsx-e6f97bb1f2314580" + " " + "mt-6 inline-flex min-w-36 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark",
                                        children: "Nice"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e6f97bb1f2314580" + " " + "pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2",
                children: stackedToasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e6f97bb1f2314580" + " " + "pointer-events-auto relative overflow-hidden rounded-xl border border-primary/20 bg-white px-4 py-3 shadow-[0_12px_32px_rgba(16,24,40,0.14)]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-e6f97bb1f2314580" + " " + "flex items-start justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-e6f97bb1f2314580",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-e6f97bb1f2314580" + " " + "text-sm font-semibold text-text-primary",
                                            children: toast.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                            lineNumber: 158,
                                            columnNumber: 17
                                        }, this),
                                        toast.description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-e6f97bb1f2314580" + " " + "mt-1 text-xs leading-relaxed text-text-secondary",
                                            children: toast.description
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                            lineNumber: 160,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>dismissToast(toast.id),
                                    "aria-label": "Dismiss toast",
                                    className: "jsx-e6f97bb1f2314580" + " " + "text-text-muted transition-colors hover:text-text-primary",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        className: "jsx-e6f97bb1f2314580",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "18",
                                                y1: "6",
                                                x2: "6",
                                                y2: "18",
                                                className: "jsx-e6f97bb1f2314580"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                lineNumber: 172,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "6",
                                                y1: "6",
                                                x2: "18",
                                                y2: "18",
                                                className: "jsx-e6f97bb1f2314580"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this)
                    }, toast.id, false, {
                        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "e6f97bb1f2314580",
                children: "@keyframes toast-confetti-burst{0%{opacity:0;transform:translate(0)rotate(0)scale(.7)}12%{opacity:1}to{opacity:0;transform:translate3d(var(--confetti-x),var(--confetti-y),0)rotate(var(--confetti-r))scale(1)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(ToastProvider, "2I74xoUu9ql3fAsAY0qGKUlq/jw=");
_c1 = ToastProvider;
function useToast() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
_s1(useToast, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c, _c1;
__turbopack_context__.k.register(_c, "CelebrationConfetti");
__turbopack_context__.k.register(_c1, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_6e952c8d._.js.map