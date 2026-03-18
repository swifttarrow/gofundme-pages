"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/fundraiser/progress-bar";
import { SeedFundraiser, formatCents } from "@/lib/seed-data";

const SUGGESTED_AMOUNTS = [25, 50, 100, 250];
const TIP_OPTIONS = [
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "20%", value: 20 },
  { label: "Other", value: "other" as const },
];

interface DonationModuleProps {
  fundraiser: SeedFundraiser;
  onDonate?: (amountCents: number, tipPercent: number | "other") => void;
}

export function DonationModule({ fundraiser, onDonate }: DonationModuleProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [tipOption, setTipOption] = useState<number | "other">(10);
  const [showDonations, setShowDonations] = useState(false);

  const amountDollars = selectedAmount ?? (parseFloat(customAmount) || 0);
  const amountCents = Math.round(amountDollars * 100);
  const tipCents =
    tipOption === "other" ? 0 : Math.round((amountCents * tipOption) / 100);
  const totalCents = amountCents + tipCents;

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function handleCustomAmountChange(val: string) {
    setCustomAmount(val);
    setSelectedAmount(null);
  }

  function handleDonate() {
    if (amountCents <= 0) return;
    if (onDonate) {
      onDonate(amountCents, tipOption);
    } else {
      alert(
        `Donation of ${formatCents(amountCents)} + tip ${formatCents(tipCents)} = ${formatCents(totalCents)} submitted!`
      );
    }
  }

  return (
    <div className="bg-white border border-border-light rounded-lg p-5 shadow-sm">
      {/* Progress */}
      <ProgressBar
        raisedCents={fundraiser.raisedCents}
        goalCents={fundraiser.goalCents}
        donorCount={fundraiser.donorCount}
        progressPercent={fundraiser.progressPercent}
      />

      {/* Toggle donations */}
      <div className="flex items-center justify-between mt-3 mb-4">
        <span className="text-sm text-text-secondary">{fundraiser.donorCount.toLocaleString()} donations</span>
        <button
          onClick={() => setShowDonations(!showDonations)}
          className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ backgroundColor: showDonations ? "#00B964" : "#D0D0D0" }}
          aria-label="Toggle donations visibility"
        >
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: showDonations ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
      </div>

      {/* Choose amount */}
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        Choose an amount
      </p>

      {/* Suggested amounts */}
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

      {/* Custom amount */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
        <input
          type="number"
          min="1"
          placeholder="Enter your amount"
          value={customAmount}
          onChange={(e) => handleCustomAmountChange(e.target.value)}
          className="w-full pl-7 pr-3 py-2.5 border border-border-medium rounded-md text-sm
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                     placeholder:text-text-muted"
        />
      </div>

      {/* Tip selector */}
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        Tip GoSupportMe websites
      </p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {TIP_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setTipOption(opt.value)}
            className={`py-2 text-sm font-semibold rounded-md border transition-all ${
              tipOption === opt.value
                ? "bg-primary border-primary text-white"
                : "border-border-medium text-text-primary hover:border-primary hover:text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Donate button */}
      <button
        onClick={handleDonate}
        disabled={amountCents <= 0}
        className="w-full bg-primary text-white font-bold py-3.5 rounded-md hover:bg-primary-dark
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        {amountCents > 0
          ? `Donate ${formatCents(totalCents)}`
          : "Donate now"}
      </button>

      {/* Share button */}
      <button className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-border-medium
                          rounded-md text-sm font-medium text-text-primary hover:bg-bg-gray transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>
    </div>
  );
}
