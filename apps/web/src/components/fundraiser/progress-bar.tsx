import { formatCents } from "@/lib/seed-data";

interface ProgressBarProps {
  raisedCents: number;
  goalCents: number;
  donorCount: number;
  progressPercent: number;
}

export function ProgressBar({ raisedCents, goalCents, donorCount, progressPercent }: ProgressBarProps) {
  const clampedPercent = Math.min(progressPercent, 100);

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

      {/* Progress bar */}
      <div className="h-2 bg-border-light rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${clampedPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Donor count */}
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">{donorCount.toLocaleString()}</span>
        {" "}donations
      </p>
    </div>
  );
}
