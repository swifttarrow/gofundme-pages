import Image from "next/image";
import { SeedUser, formatCents } from "@/lib/seed-data";
import { Badges, MOCK_BADGES } from "@/components/badges";

interface ProfileHeaderProps {
  user: SeedUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div>
      {/* Cover image */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-text-primary rounded-lg">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop"
          alt="Profile cover"
          fill
          className="object-cover opacity-70"
          sizes="100vw"
          priority
        />
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 px-4 sm:px-0">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-bg-gray flex-shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 sm:pb-2">
          <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
          {user.location && (
            <p className="text-sm text-text-muted mt-0.5 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {user.location}
            </p>
          )}
          {user.bio && (
            <p className="text-sm text-text-secondary mt-2 max-w-lg">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 flex flex-wrap gap-6 px-4 sm:px-0">
        <StatItem value={formatCents(user.amountRaised)} label="raised" />
        <StatItem value={String(user.followerCount)} label="followers" />
        <StatItem value={String(user.fundraiserCount)} label="fundraisers" />
        <StatItem value={String(user.donationCount)} label="donations" />
      </div>

      {/* Badges */}
      <div className="mt-4 px-4 sm:px-0">
        <Badges badges={MOCK_BADGES} maxVisible={5} />
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
