import Image from "next/image";
import Link from "next/link";
import { SEED_USERS, SEED_FUNDRAISERS } from "@/lib/seed-data";

interface FeedPost {
  id: string;
  author: { name: string; avatar: string | null };
  fundraiserTitle: string;
  fundraiserId: string;
  content: string;
  likeCount: number;
  timeAgo: string;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    author: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    fundraiserTitle: "Help the Martinez Family Rebuild After the Fire",
    fundraiserId: SEED_FUNDRAISERS[0].id,
    content:
      "Thank you for your incredible support! The Martinez family has found temporary housing and the kids are back at school. We're overwhelmed by the generosity of this community. Every donation, share, and kind word has made a difference.",
    likeCount: 34,
    timeAgo: "4 hours ago",
  },
  {
    id: "2",
    author: { name: "Jessica Rivera", avatar: "https://i.pravatar.cc/150?img=3" },
    fundraiserTitle: "Support Donna's Cancer Treatment Journey",
    fundraiserId: SEED_FUNDRAISERS[1].id,
    content:
      "Donna had her second chemotherapy session today and is showing incredible strength. The funds you've raised are already covering her treatment costs. Your generosity is literally saving her life. Thank you from the bottom of our hearts.",
    likeCount: 89,
    timeAgo: "1 day ago",
  },
  {
    id: "3",
    author: { name: "Junisha Bhorman", avatar: "https://i.pravatar.cc/150?img=5" },
    fundraiserTitle: "New Playground for Lincoln Elementary",
    fundraiserId: SEED_FUNDRAISERS[2].id,
    content:
      "We've hit 25% of our goal in just one week! The kids at Lincoln Elementary are so excited. We broke ground today and the new playground equipment arrives next month. Thank you to all 214 donors!",
    likeCount: 127,
    timeAgo: "2 days ago",
  },
];

export function CommunityFeed() {
  return (
    <section>
      <h2 className="text-lg font-bold text-text-primary mb-4">Community Feed</h2>
      <div className="space-y-5">
        {MOCK_POSTS.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

function FeedPost({ post }: { post: FeedPost }) {
  return (
    <div className="border-b border-border-light pb-5">
      {/* Author */}
      <div className="flex items-center gap-2 mb-2">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-bg-gray flex-shrink-0">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              {post.author.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <span className="text-sm font-semibold text-text-primary">{post.author.name}</span>
          <span className="text-xs text-text-muted ml-1">posted an update</span>
        </div>
        <span className="text-xs text-text-muted ml-auto">{post.timeAgo}</span>
      </div>

      {/* Content */}
      <p className="text-sm text-text-secondary leading-relaxed mb-2">{post.content}</p>

      {/* Link to fundraiser */}
      <Link
        href={`/fundraiser/${post.fundraiserId}`}
        className="text-xs text-primary font-medium hover:underline"
      >
        {post.fundraiserTitle} →
      </Link>

      {/* Likes */}
      <div className="flex items-center gap-1 mt-3">
        <button className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {post.likeCount.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
