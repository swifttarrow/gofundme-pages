export interface SeedUser {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  role: "donor" | "organizer" | "admin";
  amountRaised: number;
  followerCount: number;
  fundraiserCount: number;
  donationCount: number;
}

export interface SeedFundraiser {
  id: string;
  communityId: string | null;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string | null;
  title: string;
  story: string;
  coverImageUrl: string;
  goalCents: number;
  raisedCents: number;
  category: string;
  location: string;
  isUrgent: boolean;
  donorCount: number;
  followerCount: number;
  createdAt: string;
  progressPercent: number;
}

export interface SeedCommunity {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  coverImageUrl: string;
}

export interface SeedDonation {
  id: string;
  fundraiserId: string;
  donorName: string;
  donorAvatar: string | null;
  amountCents: number;
  message: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

export interface SeedNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  reasonText: string;
  deepLink: string;
  isRead: boolean;
  isBundled: boolean;
  bundleCount: number;
  createdAt: string;
}

export interface SeedNetworkPost {
  id: string;
  authorId: string;
  fundraiserId: string;
  content: string;
  createdAt: string;
}

export interface SeedFavorite {
  id: string;
  userId: string;
  fundraiserId: string;
  createdAt: string;
}

export const SEED_USERS: SeedUser[] = [
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
    donationCount: 89,
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
    donationCount: 23,
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
    donationCount: 45,
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
    donationCount: 162,
  },
];

export const SEED_COMMUNITIES: SeedCommunity[] = [
  {
    id: "c1",
    name: "Bay Area Community Support",
    slug: "bay-area-community-support",
    description: "Neighbors helping neighbors through life's challenges.",
    memberCount: 2647,
    coverImageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop",
  },
  {
    id: "c2",
    name: "Education Access Network",
    slug: "education-access-network",
    description: "Supporting schools, students, and community learning programs.",
    memberCount: 1982,
    coverImageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop",
  },
  {
    id: "c3",
    name: "Local Disaster Relief Circle",
    slug: "local-disaster-relief-circle",
    description: "Rapid response support during fires, floods, and severe weather.",
    memberCount: 3105,
    coverImageUrl:
      "https://images.unsplash.com/photo-1469571486292-b53601020f00?w=1200&auto=format&fit=crop",
  },
];

export const SEED_FUNDRAISERS: SeedFundraiser[] = [
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
    progressPercent: 57,
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
    progressPercent: 123,
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
    progressPercent: 25,
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
    progressPercent: 110,
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
    progressPercent: 100,
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
    progressPercent: 100,
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
    progressPercent: 100,
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
    progressPercent: 59,
  },
  {
    id: "b1b2c3d4-0010-0010-0010-000000000010",
    communityId: "c3",
    organizerId: "a1b2c3d4-0001-0001-0001-000000000001",
    organizerName: "Sarah Johnson",
    organizerAvatar: "https://i.pravatar.cc/150?img=1",
    title: "College Fund for Displaced Students",
    story: `Students who lost their homes in the wildfire now face losing their education too. Three students had to withdraw from college when their families became homeless. Help us keep their college dreams alive with emergency scholarships.`,
    coverImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
    goalCents: 4000000,
    raisedCents: 4068000,
    category: "Education",
    location: "Santa Barbara, CA",
    isUrgent: false,
    donorCount: 567,
    followerCount: 234,
    createdAt: "2024-02-10T10:00:00Z",
    progressPercent: 100,
  },
];

export const SEED_DONATIONS: SeedDonation[] = [
  {
    id: "d1",
    fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
    donorName: "Michael Chen",
    donorAvatar: "https://i.pravatar.cc/150?img=2",
    amountCents: 15000,
    message: "Sending love and prayers to the Martinez family. Stay strong!",
    isAnonymous: false,
    createdAt: "2024-03-15T14:22:00Z",
  },
  {
    id: "d2",
    fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
    donorName: "Anonymous",
    donorAvatar: null,
    amountCents: 10000,
    message: "Sending love and caring units in difficult times.",
    isAnonymous: true,
    createdAt: "2024-03-14T09:15:00Z",
  },
  {
    id: "d3",
    fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
    donorName: "Jessica Rivera",
    donorAvatar: "https://i.pravatar.cc/150?img=3",
    amountCents: 9000,
    message: "This community is here for you. Every little helps.",
    isAnonymous: false,
    createdAt: "2024-03-13T16:48:00Z",
  },
];

export const SEED_NOTIFICATIONS: SeedNotification[] = [
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
    createdAt: "2024-03-15T10:00:00Z",
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
    createdAt: "2024-03-14T16:00:00Z",
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
    createdAt: "2024-03-13T12:00:00Z",
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
    createdAt: "2024-03-12T08:00:00Z",
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
    createdAt: "2024-03-11T14:00:00Z",
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
    createdAt: "2024-03-10T10:00:00Z",
  },
];

export const SEED_NETWORK_POSTS: SeedNetworkPost[] = [
  {
    id: "p1",
    authorId: "a1b2c3d4-0001-0001-0001-000000000001",
    fundraiserId: "b1b2c3d4-0004-0004-0004-000000000004",
    content: "We secured temporary shelter for 12 families this week. Thank you for continuing to share and support.",
    createdAt: "2026-03-17T18:40:00Z",
  },
  {
    id: "p2",
    authorId: "a1b2c3d4-0003-0003-0003-000000000003",
    fundraiserId: "b1b2c3d4-0002-0002-0002-000000000002",
    content: "Donna completed another treatment round today. Community support is making this possible.",
    createdAt: "2026-03-18T14:10:00Z",
  },
  {
    id: "p3",
    authorId: "a1b2c3d4-0005-0005-0005-000000000005",
    fundraiserId: "b1b2c3d4-0003-0003-0003-000000000003",
    content: "Construction plans are approved and playground installation starts next month!",
    createdAt: "2026-03-18T08:25:00Z",
  },
  {
    id: "p4",
    authorId: "a1b2c3d4-0001-0001-0001-000000000001",
    fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
    content: "The Martinez family moved into stable housing today. Your help changed everything.",
    createdAt: "2026-03-16T21:05:00Z",
  },
];

export const SEED_FAVORITES: SeedFavorite[] = [
  {
    id: "fav-1",
    userId: "a1b2c3d4-0002-0002-0002-000000000002",
    fundraiserId: "b1b2c3d4-0001-0001-0001-000000000001",
    createdAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "fav-2",
    userId: "a1b2c3d4-0002-0002-0002-000000000002",
    fundraiserId: "b1b2c3d4-0003-0003-0003-000000000003",
    createdAt: "2026-03-16T10:20:00Z",
  },
  {
    id: "fav-3",
    userId: "a1b2c3d4-0002-0002-0002-000000000002",
    fundraiserId: "b1b2c3d4-0008-0008-0008-000000000008",
    createdAt: "2026-03-17T07:45:00Z",
  },
  {
    id: "fav-4",
    userId: "a1b2c3d4-0002-0002-0002-000000000002",
    fundraiserId: "b1b2c3d4-0009-0009-0009-000000000009",
    createdAt: "2026-03-17T20:15:00Z",
  },
];

export function formatCents(cents: number): string {
  if (cents >= 100000) {
    return `$${(cents / 100000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatCentsExact(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function timeAgo(dateStr: string): string {
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
