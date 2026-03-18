"use client";

import { useState } from "react";

interface StoryProps {
  story: string;
  organizerName: string;
}

export function Story({ story, organizerName }: StoryProps) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_LENGTH = 400;
  const shouldTruncate = story.length > PREVIEW_LENGTH;
  const displayText = expanded || !shouldTruncate ? story : story.slice(0, PREVIEW_LENGTH) + "...";

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-3">Story</h2>
      <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
        {displayText}
      </div>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-border-light flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <span className="text-xs text-text-muted">
          <span className="font-medium text-text-secondary">{organizerName}</span> is a certified organizer
        </span>
      </div>
    </div>
  );
}
