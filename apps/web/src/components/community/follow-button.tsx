"use client";

import { useEffect, useState } from "react";

const COMMUNITY_FOLLOW_STORAGE_KEY = "community:bay-area-support:is-following";

export function CommunityFollowButton() {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const persisted = window.localStorage.getItem(COMMUNITY_FOLLOW_STORAGE_KEY);
    if (persisted === "true") {
      setIsFollowing(true);
    }
  }, []);

  function handleToggle() {
    const next = !isFollowing;
    setIsFollowing(next);
    window.localStorage.setItem(COMMUNITY_FOLLOW_STORAGE_KEY, String(next));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`text-sm font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors ${
        isFollowing
          ? "bg-primary text-white hover:bg-primary-dark"
          : "bg-white text-text-primary hover:bg-bg-gray"
      }`}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? "Unfollow community" : "Follow community"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {isFollowing ? <path d="M20 6L9 17l-5-5" /> : <path d="M12 5v14M5 12h14" />}
      </svg>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
