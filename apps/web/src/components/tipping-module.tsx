"use client";

import { useState } from "react";
import { formatCentsExact } from "@/lib/seed-data";

const TIP_OPTIONS = [
  { label: "0%", value: 0 },
  { label: "5%", value: 5 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "20%", value: 20 },
];

interface TippingModuleProps {
  fundraiserTitle: string;
  amountCents: number;
  onComplete?: (tipCents: number, totalCents: number) => void;
}

export function TippingModule({ fundraiserTitle, amountCents, onComplete }: TippingModuleProps) {
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [showTipInfo, setShowTipInfo] = useState(false);

  const tipCents = Math.round((amountCents * tipPercent) / 100);
  const totalCents = amountCents + tipCents;

  function handleDonate() {
    if (onComplete) {
      onComplete(tipCents, totalCents);
    }
  }

  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-xl border border-border-light p-6">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-text-primary">Complete your donation</h2>
        <p className="text-sm text-text-muted mt-0.5">{fundraiserTitle}</p>
      </div>

      {/* Donation amount display */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-text-primary">Your donation</span>
        <span className="text-base font-bold text-text-primary">{formatCentsExact(amountCents)}</span>
      </div>

      {/* Tip section */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-text-primary mb-1">
          Support GoSupportMe <span className="text-text-muted font-normal text-sm">(optional)</span>
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Your tip helps keep GoSupportMe free for people raising money.
        </p>

        {/* Tip buttons */}
        <div className="flex gap-2">
          {TIP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTipPercent(opt.value)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md border transition-all ${
                tipPercent === opt.value
                  ? "bg-primary border-primary text-white"
                  : "border-border-medium text-text-primary hover:border-primary hover:text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tip confirmation */}
      {tipPercent > 0 && (
        <div className="bg-primary-light border border-primary/20 rounded-md px-3 py-2.5 mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-sm text-primary font-medium">
            You chose to tip {tipPercent}% to support GoSupportMe
          </span>
        </div>
      )}

      {/* How tip helps - expandable */}
      <div className="mb-5 border border-border-light rounded-md overflow-hidden">
        <button
          onClick={() => setShowTipInfo(!showTipInfo)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-faint transition-colors"
        >
          <span>See how your tip helps</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${showTipInfo ? "rotate-180" : ""}`}
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>
        {showTipInfo && (
          <div className="px-3 pb-3 border-t border-border-light">
            {[
              "Payments processing",
              "Platform infrastructure &amp; uptime",
              "Fraud prevention &amp; safety",
              "Customer support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span
                  className="text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-4 pb-4 border-b border-border-light">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Donation</span>
          <span className="text-text-primary font-medium">{formatCentsExact(amountCents)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Tip ({tipPercent}%)</span>
          <span className="text-text-primary font-medium">{formatCentsExact(tipCents)}</span>
        </div>
        <div className="flex justify-between text-base font-bold">
          <span className="text-text-primary">Total charged</span>
          <span className="text-text-primary">{formatCentsExact(totalCents)}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 mb-5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <p className="text-xs text-text-muted leading-relaxed">
          100% of your donation goes to the fundraiser. Tips support GoSupportMe.
        </p>
      </div>

      {/* Donate button */}
      <button
        onClick={handleDonate}
        className="w-full bg-primary text-white font-bold py-3.5 rounded-md hover:bg-primary-dark
                   transition-colors text-base mb-3"
      >
        Donate {formatCentsExact(totalCents)}
      </button>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-text-muted">Secure payment · GoSupportMe Guarantee</span>
      </div>
    </div>
  );
}
