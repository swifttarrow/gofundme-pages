"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/fundraiser/progress-bar";
import { SeedDonation, SeedFundraiser, formatCents, timeAgo } from "@/lib/seed-data";
import { createDonation, followFundraiser, getFollowStatus, unfollowFundraiser } from "@/lib/api";
import { useToast } from "@/components/providers/toast-provider";
import { evaluateBadgesAndToast } from "@/lib/badge-awards";
import { emitAppDataRefresh } from "@/lib/client-events";
import { trackEvent } from "@/lib/analytics";

const SUGGESTED_AMOUNTS = [25, 50, 100, 250];
const MAX_TIP_PERCENT = 30;

interface DonationModuleProps {
  fundraiser: SeedFundraiser;
  donations: SeedDonation[];
  currentUserId?: string;
  onDonate?: (amountCents: number, tipPercent: number) => void;
}

export function DonationModule({ fundraiser, donations, currentUserId, onDonate }: DonationModuleProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(fundraiser.followerCount);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isDonationLoading, setIsDonationLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  const [donationError, setDonationError] = useState<string | null>(null);
  const recentDonations = donations.slice(0, 3);

  const amountDollars = selectedAmount ?? (parseFloat(customAmount) || 0);
  const amountCents = Math.round(amountDollars * 100);
  const tipCents = Math.round((amountCents * tipPercent) / 100);
  const totalCents = amountCents + tipCents;

  useEffect(() => {
    if (!isDonationModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDonationModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isDonationModalOpen]);

  useEffect(() => {
    if (!isDonationModalOpen) {
      setModalStep(1);
    }
  }, [isDonationModalOpen]);

  useEffect(() => {
    let cancelled = false;
    if (!currentUserId) return;

    setFollowError(null);
    getFollowStatus({ followerUserId: currentUserId, fundraiserId: fundraiser.id })
      .then((result) => {
        if (!cancelled) setIsFollowing(result.isFollowing);
      })
      .catch(() => {
        if (!cancelled) setFollowError("Could not load follow state.");
      });

    return () => {
      cancelled = true;
    };
  }, [currentUserId, fundraiser.id]);

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function handleCustomAmountChange(val: string) {
    setCustomAmount(val);
    setSelectedAmount(null);
  }

  function openDonationModal() {
    trackEvent("donation_modal_opened", { fundraiser_id: fundraiser.id });
    setIsDonationModalOpen(true);
  }

  async function handleDonate() {
    if (!currentUserId) {
      router.push("/sign-in");
      return;
    }
    if (isDonationLoading) return;
    if (amountCents <= 0) return;
    setDonationError(null);
    setIsDonationLoading(true);

    try {
      if (onDonate) {
        onDonate(amountCents, tipPercent);
      } else {
        await createDonation({
          fundraiserId: fundraiser.id,
          amountCents,
          tipCents,
          totalCents,
          tipPercent: [0, 5, 10, 15, 20].includes(tipPercent) ? tipPercent : "custom",
          isAnonymous: false,
          message: null,
          donorUserId: currentUserId ?? null,
        });
      }

      if (currentUserId) {
        try {
          await evaluateBadgesAndToast(currentUserId, showToast);
        } catch {
          // The donation already succeeded, so don't block the success path on badge refresh.
        }
      }

      showToast({
        title: "Donation sent",
        description: `Your donation of ${formatCents(amountCents)} was submitted successfully.`,
      });
      trackEvent("donation_submitted", {
        fundraiser_id: fundraiser.id,
        amount_cents: amountCents,
      });
      emitAppDataRefresh();
      router.refresh();
      setIsDonationModalOpen(false);
    } catch {
      setDonationError("Couldn't process your donation right now.");
    } finally {
      setIsDonationLoading(false);
    }
  }

  async function handleToggleFollow() {
    if (!currentUserId || isFollowLoading) return;

    setIsFollowLoading(true);
    setFollowError(null);

    try {
      if (isFollowing) {
        const result = await unfollowFundraiser({
          followerUserId: currentUserId,
          fundraiserId: fundraiser.id,
        });
        setIsFollowing(result.isFollowing);
        if (result.removed) setFollowerCount((count) => Math.max(count - 1, 0));
        if (result.removed) {
          trackEvent("fundraiser_follow_toggled", {
            fundraiser_id: fundraiser.id,
            action: "unfollowed",
          });
        }
      } else {
        const result = await followFundraiser({
          followerUserId: currentUserId,
          fundraiserId: fundraiser.id,
        });
        setIsFollowing(result.isFollowing);
        if (result.created) setFollowerCount((count) => count + 1);
        if (result.created) {
          trackEvent("fundraiser_follow_toggled", {
            fundraiser_id: fundraiser.id,
            action: "followed",
          });
          try {
            await evaluateBadgesAndToast(currentUserId, showToast);
          } catch {
            // Following should still succeed even if badge evaluation is temporarily unavailable.
          }
          emitAppDataRefresh();
        }
      }
    } catch {
      setFollowError("Couldn't update follow right now.");
    } finally {
      setIsFollowLoading(false);
    }
  }

  return (
    <>
      <div className="bg-white border border-border-light rounded-lg p-5 shadow-sm">
        {/* Progress */}
        <ProgressBar
          raisedCents={fundraiser.raisedCents}
          goalCents={fundraiser.goalCents}
          donorCount={fundraiser.donorCount}
          progressPercent={fundraiser.progressPercent}
        />

        <div className="mt-3 mb-4">
          {recentDonations.length > 0 ? (
            <div className="mt-2 space-y-2">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="rounded-md border border-border-light bg-bg-faint px-3 py-2">
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-bg-gray">
                        {donation.donorAvatar && !donation.isAnonymous ? (
                          <Image
                            src={donation.donorAvatar}
                            alt={donation.donorName}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white text-text-muted">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        {donation.isAnonymous || !donation.donorUserId ? (
                          <span className="block truncate font-medium text-text-primary">
                            {donation.donorName}
                          </span>
                        ) : (
                          <Link
                            href={`/profile/${donation.donorUserId}`}
                            className="block truncate font-medium text-text-primary hover:text-primary hover:underline"
                          >
                            {donation.donorName}
                          </Link>
                        )}
                        <p className="mt-0.5 text-xs text-text-muted">{timeAgo(donation.createdAt)}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">{formatCents(donation.amountCents)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button
          onClick={() => {
            if (!currentUserId) {
              router.push("/sign-in");
              return;
            }
            openDonationModal();
          }}
          className="w-full bg-primary text-white font-bold py-3.5 rounded-md hover:bg-primary-dark transition-colors text-base"
        >
          Donate now
        </button>

        <p className="mt-2 text-xs text-text-muted leading-relaxed">
          You will choose your amount in the next step. Your tip is optional, and we explain exactly what it supports.
        </p>

        <div className="mt-4 border-t border-border-light pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted">{followerCount.toLocaleString()} followers</p>
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={!currentUserId || isFollowLoading}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold border transition-colors ${
                isFollowing
                  ? "border-primary/40 bg-primary-light text-primary hover:bg-primary/15"
                  : "border-border-medium text-text-primary hover:border-primary hover:text-primary"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isFollowLoading ? "Saving..." : isFollowing ? "Following" : "Follow"}
            </button>
          </div>
          {followError && <p className="mt-2 text-xs text-accent-red">{followError}</p>}
        </div>

      </div>

      {isDonationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            className="absolute inset-0 bg-black/45"
            onClick={() => setIsDonationModalOpen(false)}
            aria-label="Close donation modal"
          />

          <div
            className="relative z-10 w-full sm:max-w-lg bg-white sm:rounded-xl shadow-xl max-h-[90vh] overflow-y-auto p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`Donate to ${fundraiser.title}`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Donate to</p>
                <h2 className="mt-0.5 text-lg font-bold text-text-primary truncate">{fundraiser.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDonationModalOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close modal"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {modalStep === 1 ? (
              <>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                  Choose an amount
                </p>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {SUGGESTED_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-2 text-sm font-semibold rounded-md border transition-all ${
                        selectedAmount === amount
                          ? "bg-primary border-primary text-white"
                          : "border-border-medium text-text-primary hover:border-primary hover:text-primary"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="relative mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter your amount"
                    value={selectedAmount !== null ? String(selectedAmount) : customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 border border-border-medium rounded-md text-sm
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                     placeholder:text-text-muted"
                  />
                </div>

                <button
                  onClick={() => setModalStep(2)}
                  disabled={amountCents <= 0}
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-md hover:bg-primary-dark
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                  Add an optional tip
                </p>

                <div className="rounded-xl border border-border-light bg-bg-faint p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text-primary">Tip amount</span>
                    <span className="text-sm font-bold text-primary">{tipPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={MAX_TIP_PERCENT}
                    step="1"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(Number(e.target.value))}
                    className="w-full accent-primary"
                    aria-label="Tip percentage"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                    <span>No tip</span>
                    <span>{MAX_TIP_PERCENT}%</span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/15 bg-primary-light p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-full bg-white shadow-sm border border-primary/10 flex items-center justify-center text-xl">
                      💚
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">What your tip helps support</p>
                      <p className="text-xs text-text-secondary leading-relaxed mt-1">
                        Your donation always goes directly to this fundraiser. Tips help keep GoSupportMe running by
                        funding secure payment processing, fraud and abuse monitoring, support for organizers and
                        donors, and the tools that make fundraising pages easy to create and share.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border-light rounded-md p-3 mb-4 text-sm">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Donation amount</span>
                    <span>{formatCents(amountCents)}</span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary mt-1">
                    <span>Tip to GoSupportMe ({tipPercent}%)</span>
                    <span>{formatCents(tipCents)}</span>
                  </div>
                  <div className="flex items-center justify-between text-text-primary font-bold mt-2 pt-2 border-t border-border-light">
                    <span>Total charged</span>
                    <span>{formatCents(totalCents)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalStep(1)}
                    disabled={isDonationLoading}
                    className="w-1/3 border border-border-medium text-text-primary font-semibold py-3 rounded-md hover:bg-bg-faint transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => void handleDonate()}
                    disabled={amountCents <= 0 || isDonationLoading}
                    className="w-2/3 bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-dark
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {isDonationLoading
                      ? "Processing..."
                      : amountCents > 0
                        ? `Donate ${formatCents(totalCents)}`
                        : "Donate now"}
                  </button>
                </div>
                {donationError ? (
                  <p className="mt-3 text-xs text-accent-red">{donationError}</p>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
