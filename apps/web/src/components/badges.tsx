interface Badge {
  type: string;
  label: string;
  description: string;
  icon: string;
  priority: number;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  "shield-check": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  "trending-up": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  flag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
};

const BADGE_COLORS: Record<string, string> = {
  "shield-check": "bg-accent-blue/10 text-accent-blue",
  "trending-up": "bg-primary-light text-primary",
  users: "bg-accent-yellow/20 text-accent-orange",
  heart: "bg-accent-red/10 text-accent-red",
  flag: "bg-primary-light text-primary-dark",
};

interface BadgesProps {
  badges: Badge[];
  maxVisible?: number;
}

export function Badges({ badges, maxVisible = 5 }: BadgesProps) {
  const sorted = [...badges].sort((a, b) => b.priority - a.priority);
  const visible = sorted.slice(0, maxVisible);
  const overflow = sorted.length - maxVisible;

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {visible.map((badge) => (
        <div
          key={badge.type}
          title={badge.description}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
            BADGE_COLORS[badge.icon] ?? "bg-bg-gray text-text-secondary"
          }`}
        >
          <span className="flex-shrink-0">
            {BADGE_ICONS[badge.icon] ?? null}
          </span>
          <span className="hidden sm:inline">{badge.label}</span>
        </div>
      ))}
      {overflow > 0 && (
        <div className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-bg-gray text-text-muted">
          +{overflow} more
        </div>
      )}
    </div>
  );
}

// Mock badges for seed data
export const MOCK_BADGES: Badge[] = [
  {
    type: "trust_pioneer",
    label: "Trust Pioneer",
    description: "One of the first verified fundraisers on GoSupportMe",
    icon: "shield-check",
    priority: 100,
  },
  {
    type: "momentum_builder",
    label: "Momentum Builder",
    description: "Raised 50% of goal within the first 48 hours",
    icon: "trending-up",
    priority: 90,
  },
  {
    type: "community_champion",
    label: "Community Champion",
    description: "Fundraiser reached 500+ donors",
    icon: "users",
    priority: 80,
  },
];
