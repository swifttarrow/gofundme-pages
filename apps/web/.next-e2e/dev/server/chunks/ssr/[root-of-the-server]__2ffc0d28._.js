module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/apps/web/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/web/src/lib/seed-data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/apps/web/src/components/fundraiser/hero.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FundraiserHero",
    ()=>FundraiserHero
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FundraiserHero = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FundraiserHero() from the server but FundraiserHero is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/fundraiser/hero.tsx <module evaluation>", "FundraiserHero");
}),
"[project]/apps/web/src/components/fundraiser/hero.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FundraiserHero",
    ()=>FundraiserHero
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FundraiserHero = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FundraiserHero() from the server but FundraiserHero is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/fundraiser/hero.tsx", "FundraiserHero");
}),
"[project]/apps/web/src/components/fundraiser/hero.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/hero.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/hero.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/fundraiser/story.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Story",
    ()=>Story
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Story = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Story() from the server but Story is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/fundraiser/story.tsx <module evaluation>", "Story");
}),
"[project]/apps/web/src/components/fundraiser/story.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Story",
    ()=>Story
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Story = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Story() from the server but Story is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/fundraiser/story.tsx", "Story");
}),
"[project]/apps/web/src/components/fundraiser/story.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$story$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/story.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$story$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/story.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$story$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/fundraiser/donation-feed.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DonationFeed",
    ()=>DonationFeed
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DonationFeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DonationFeed() from the server but DonationFeed is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/fundraiser/donation-feed.tsx <module evaluation>", "DonationFeed");
}),
"[project]/apps/web/src/components/fundraiser/donation-feed.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DonationFeed",
    ()=>DonationFeed
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DonationFeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DonationFeed() from the server but DonationFeed is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/fundraiser/donation-feed.tsx", "DonationFeed");
}),
"[project]/apps/web/src/components/fundraiser/donation-feed.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$donation$2d$feed$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/donation-feed.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$donation$2d$feed$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/donation-feed.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$donation$2d$feed$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/components/fundraiser/trust-safety.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrustSafety",
    ()=>TrustSafety
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function TrustSafety() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-6 pt-6 border-t border-border-light",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-base font-bold text-text-primary mb-3",
                children: "Trust & Safety"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-text-secondary mb-4 leading-relaxed",
                children: "GoSupportMe protects your donation. We guarantee you a full refund for up to a year in the rare case that funds aren't delivered to the right person."
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                lineNumber: 5,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    "GoSupportMe Giving Guarantee",
                    "Expert fundraising advice",
                    "Secure payments &amp; fraud protection"
                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "#00B964",
                                strokeWidth: "2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                                    lineNumber: 25,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                                lineNumber: 17,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-text-secondary",
                                dangerouslySetInnerHTML: {
                                    __html: item
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item, true, {
                        fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 pt-4 border-t border-border-light",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "#6B6B6B",
                            strokeWidth: "2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "12",
                                    cy: "12",
                                    r: "10"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "12,6 12,12 16,14"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-text-muted",
                            children: "Created March 1, 2024"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-text-muted mx-1",
                            children: "·"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs bg-accent-red/10 text-accent-red font-medium px-1.5 py-0.5 rounded-sm",
                            children: "Emergency"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs bg-accent-yellow/20 text-accent-orange font-medium px-1.5 py-0.5 rounded-sm ml-1",
                            children: "Tax deductible"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/fundraiser/trust-safety.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/donation-module.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DonationModule",
    ()=>DonationModule
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DonationModule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DonationModule() from the server but DonationModule is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/donation-module.tsx <module evaluation>", "DonationModule");
}),
"[project]/apps/web/src/components/donation-module.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DonationModule",
    ()=>DonationModule
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DonationModule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DonationModule() from the server but DonationModule is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/web/src/components/donation-module.tsx", "DonationModule");
}),
"[project]/apps/web/src/components/donation-module.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$donation$2d$module$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/donation-module.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$donation$2d$module$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/donation-module.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$donation$2d$module$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/web/src/app/fundraiser/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FundraiserPage,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/seed-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/hero.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$story$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/story.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$donation$2d$feed$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/donation-feed.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$trust$2d$safety$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/fundraiser/trust-safety.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$donation$2d$module$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/donation-module.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const API_BASE = ("TURBOPACK compile-time value", "http://127.0.0.1:3101") ?? "http://localhost:3001";
const APP_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:3100") ?? "http://localhost:3000";
const DEFAULT_FUNDRAISER_IMAGE = "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop";
async function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SEED_FUNDRAISERS"].map((f)=>({
            id: f.id
        }));
}
async function getAuthenticatedUserId() {
    const sessionToken = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get("gosupportme_session")?.value;
    if (!sessionToken) return null;
    try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
                Cookie: `gosupportme_session=${sessionToken}`
            },
            cache: "no-store"
        });
        if (!response.ok) return null;
        const payload = await response.json();
        return payload.user.id;
    } catch  {
        return null;
    }
}
async function getApiFundraiser(id) {
    try {
        const response = await fetch(`${API_BASE}/api/fundraisers/${id}`, {
            cache: "no-store"
        });
        if (!response.ok) return null;
        return await response.json();
    } catch  {
        return null;
    }
}
function mapApiFundraiserToSeed(fundraiser) {
    return {
        id: fundraiser.id,
        communityId: null,
        organizerId: fundraiser.organizer_id,
        organizerName: fundraiser.organizer_name,
        organizerAvatar: fundraiser.organizer_avatar,
        title: fundraiser.title,
        story: fundraiser.story,
        coverImageUrl: fundraiser.cover_image_url ?? DEFAULT_FUNDRAISER_IMAGE,
        goalCents: Number(fundraiser.goal_cents ?? 0),
        raisedCents: Number(fundraiser.raised_cents ?? 0),
        category: fundraiser.category,
        location: fundraiser.location ?? "",
        isUrgent: Boolean(fundraiser.is_urgent),
        donorCount: Number(fundraiser.donor_count ?? 0),
        followerCount: Number(fundraiser.follower_count ?? 0),
        createdAt: fundraiser.created_at,
        progressPercent: Number(fundraiser.progressPercent ?? 0)
    };
}
function mapApiDonationToSeed(fundraiserId, donation) {
    return {
        id: donation.id,
        fundraiserId,
        donorUserId: donation.donor_user_id,
        donorName: donation.donor_name,
        donorAvatar: donation.donor_avatar,
        amountCents: Number(donation.amount_cents ?? 0),
        message: donation.message,
        isAnonymous: donation.is_anonymous,
        createdAt: donation.created_at
    };
}
function buildFundraiserDescription(fundraiser) {
    const normalizedStory = fundraiser.story.replace(/\s+/g, " ").trim();
    const summary = normalizedStory.slice(0, 140).trim();
    if (summary.length > 0) {
        return `${summary}${normalizedStory.length > 140 ? "..." : ""}`;
    }
    return `Support ${fundraiser.organizerName}'s fundraiser on GoSupportMe.`;
}
async function generateMetadata({ params }) {
    const { id } = await params;
    const apiFundraiser = await getApiFundraiser(id);
    const fundraiser = apiFundraiser ? mapApiFundraiserToSeed(apiFundraiser) : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SEED_FUNDRAISERS"].find((f)=>f.id === id);
    if (!fundraiser) return {
        title: "Fundraiser Not Found"
    };
    const description = buildFundraiserDescription(fundraiser);
    const fundraiserUrl = `${APP_URL}/fundraiser/${fundraiser.id}`;
    return {
        title: `${fundraiser.title} | GoSupportMe`,
        description,
        alternates: {
            canonical: `/fundraiser/${fundraiser.id}`
        },
        openGraph: {
            title: fundraiser.title,
            description,
            url: fundraiserUrl,
            siteName: "GoSupportMe",
            type: "article",
            images: [
                {
                    url: fundraiser.coverImageUrl,
                    alt: fundraiser.title
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: fundraiser.title,
            description,
            images: [
                fundraiser.coverImageUrl
            ]
        }
    };
}
async function FundraiserPage({ params }) {
    const { id } = await params;
    const apiFundraiser = await getApiFundraiser(id);
    const fundraiser = apiFundraiser ? mapApiFundraiserToSeed(apiFundraiser) : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SEED_FUNDRAISERS"].find((f)=>f.id === id);
    if (!fundraiser) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    const currentUserId = await getAuthenticatedUserId();
    const donations = apiFundraiser ? apiFundraiser.recentDonations.map((donation)=>mapApiDonationToSeed(fundraiser.id, donation)) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto px-4 py-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col lg:flex-row gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FundraiserHero"], {
                                fundraiser: fundraiser
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:hidden mt-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$donation$2d$module$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DonationModule"], {
                                    fundraiser: fundraiser,
                                    donations: donations,
                                    currentUserId: currentUserId ?? undefined
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$story$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Story"], {
                                    story: fundraiser.story,
                                    organizerName: fundraiser.organizerName
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                    lineNumber: 205,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$donation$2d$feed$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DonationFeed"], {
                                    donations: donations,
                                    totalCount: fundraiser.donorCount,
                                    currentUserId: currentUserId ?? undefined
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$fundraiser$2f$trust$2d$safety$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TrustSafety"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden lg:block w-full max-w-sm flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$donation$2d$module$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DonationModule"], {
                                fundraiser: fundraiser,
                                donations: donations,
                                currentUserId: currentUserId ?? undefined
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                                lineNumber: 222,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                            lineNumber: 221,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/fundraiser/[id]/page.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/app/fundraiser/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/app/fundraiser/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2ffc0d28._.js.map