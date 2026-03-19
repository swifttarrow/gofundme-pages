"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CampaignCard } from "@/components/community/campaign-card";
import { SeedFundraiser } from "@/lib/seed-data";
import { getFeed } from "@/lib/api";
import { toSeedFundraiser } from "@/lib/fundraiser-view";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Urgent", value: "urgent" },
  { label: "Trending", value: "trending" },
  { label: "Recent", value: "recent" },
] as const;

export function CommunityFeed() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]["value"]>("all");
  const [items, setItems] = useState<SeedFundraiser[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(
    async (cursor?: string | null) => {
      const result = await getFeed({
        sort: activeFilter === "all" ? undefined : activeFilter,
        cursor: cursor ?? undefined,
        limit: 6,
      });

      return {
        items: result.items.map((item) =>
          toSeedFundraiser({
            id: item.id,
            organizerName: item.organizerName,
            organizerAvatar: item.organizerAvatar,
            title: item.title,
            coverImageUrl: item.coverImageUrl,
            goalCents: item.goalCents,
            raisedCents: item.raisedCents,
            category: item.category,
            location: item.location,
            isUrgent: item.isUrgent,
            donorCount: item.donorCount,
            followerCount: item.followerCount,
            createdAt: item.createdAt,
            progressPercent: item.progressPercent,
          })
        ),
        nextCursor: result.nextCursor,
      };
    },
    [activeFilter]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setIsLoadingInitial(true);
      setError(null);

      try {
        const result = await loadPage();
        if (!cancelled) {
          setItems(result.items);
          setNextCursor(result.nextCursor);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setNextCursor(null);
          setError("Unable to load the community feed right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingInitial(false);
        }
      }
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [loadPage]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !nextCursor || isLoadingInitial || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        setIsLoadingMore(true);
        void loadPage(nextCursor)
          .then((result) => {
            setItems((current) => {
              const seen = new Set(current.map((item) => item.id));
              return [
                ...current,
                ...result.items.filter((item) => !seen.has(item.id)),
              ];
            });
            setNextCursor(result.nextCursor);
          })
          .catch(() => {
            setError("Unable to load more campaigns right now.");
          })
          .finally(() => {
            setIsLoadingMore(false);
          });
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoadingInitial, isLoadingMore, loadPage, nextCursor]);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Community Feed</h2>
          <p className="text-sm text-text-secondary mt-1">
            Browse active fundraisers with live sorting and continuous loading.
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
              activeFilter === tab.value
                ? "bg-text-primary text-white border-text-primary"
                : "border-border-medium text-text-secondary hover:border-text-primary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-accent-red/20 bg-red-50 px-4 py-3 text-sm text-accent-red mb-4">
          {error}
        </div>
      ) : null}

      {isLoadingInitial ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 rounded-lg border border-border-light bg-bg-faint animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <CampaignCard key={item.id} fundraiser={item} />
            ))}
          </div>
          <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
          {isLoadingMore ? (
            <p className="text-sm text-text-muted mt-3">Loading more campaigns...</p>
          ) : null}
        </>
      ) : (
        <div className="rounded-lg border border-border-light bg-white px-4 py-6 text-sm text-text-secondary">
          No campaigns match this filter yet.
        </div>
      )}
    </section>
  );
}
