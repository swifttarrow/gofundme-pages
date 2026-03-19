import { formatCents } from "@/lib/seed-data";

interface ProgressBarProps {
  raisedCents: number;
  goalCents: number;
  donorCount: number;
  progressPercent: number;
}

export function ProgressBar({ raisedCents, goalCents, donorCount, progressPercent }: ProgressBarProps) {
  const clampedPercent = Math.min(progressPercent, 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div>
      {/* Raised amount */}
      <div className="mb-1">
        <span className="text-2xl font-bold text-text-primary">
          {formatCents(raisedCents)}
        </span>
        <span className="text-sm text-text-secondary ml-1">
          raised of {formatCents(goalCents)} goal
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div
          className="relative h-[72px] w-[72px] flex-shrink-0"
          role="progressbar"
          aria-label="Fundraiser progress"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border-light"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-text-primary">{Math.round(clampedPercent)}%</span>
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">{donorCount.toLocaleString()}</span>
          {" "}donations
        </p>
      </div>
    </div>
  );
}
