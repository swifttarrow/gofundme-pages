import Image from "next/image";
import { SeedFundraiser } from "@/lib/seed-data";

interface HeroProps {
  fundraiser: SeedFundraiser;
}

export function FundraiserHero({ fundraiser }: HeroProps) {
  return (
    <div>
      {/* Cover Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden bg-bg-gray">
        <Image
          src={fundraiser.coverImageUrl}
          alt={fundraiser.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        {fundraiser.isUrgent && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent-red text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
              Urgent
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-5 leading-tight">
        {fundraiser.title}
      </h1>

      {/* Organizer badge */}
      <div className="flex items-center gap-2 mt-3">
        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-primary flex-shrink-0">
          {fundraiser.organizerAvatar ? (
            <Image
              src={fundraiser.organizerAvatar}
              alt={fundraiser.organizerName}
              fill
              className="object-cover"
              sizes="24px"
            />
          ) : (
            <span className="text-white text-xs flex items-center justify-center h-full font-bold">
              {fundraiser.organizerName.charAt(0)}
            </span>
          )}
        </div>
        <span className="text-sm text-text-secondary">
          <span className="text-text-primary font-medium">{fundraiser.organizerName}</span>
          {" "}is organizing this fundraiser for{" "}
          <span className="font-medium">Martinez Family</span>
        </span>
      </div>

      {/* Category tag */}
      <div className="mt-2">
        <span className="text-xs text-text-muted">{fundraiser.category}</span>
        {fundraiser.location && (
          <span className="text-xs text-text-muted"> · {fundraiser.location}</span>
        )}
      </div>
    </div>
  );
}
