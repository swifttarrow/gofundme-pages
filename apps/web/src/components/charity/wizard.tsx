"use client";

import { useState } from "react";

const STEPS = [
  { id: 1, label: "Cause Definition", completed: true },
  { id: 2, label: "Story & Impact", completed: true },
  { id: 3, label: "Transparency Setup", completed: false, current: true },
  { id: 4, label: "Funding Model", completed: false },
  { id: 5, label: "Visual Identity", completed: false },
  { id: 6, label: "Review & Launch", completed: false },
];

interface Milestone {
  amount: string;
  label: string;
}

export function CharityWizard() {
  const [currentStep, setCurrentStep] = useState(3);
  const [fundAllocation, setFundAllocation] = useState(
    "70% program expenses, 15% operations, 15% fundraising"
  );
  const [milestones, setMilestones] = useState<Milestone[]>([
    { amount: "10000", label: "First round of emergency supplies" },
    { amount: "75000", label: "Long-term rebuilding assistance" },
  ]);

  function addMilestone() {
    setMilestones([...milestones, { amount: "", label: "" }]);
  }

  function updateMilestone(index: number, field: keyof Milestone, value: string) {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  }

  function removeMilestone(index: number) {
    setMilestones(milestones.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-border-light p-6 md:min-h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5.79 2 4 3.79 4 6c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-text-primary text-sm">GoSupportMe</span>
        </div>

        <h2 className="font-bold text-text-primary text-sm mb-1">Start a Charity</h2>
        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          Create a lasting cause impact in a few steps. We&apos;ll guide you through everything.
        </p>

        {/* Steps */}
        <nav className="space-y-1">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors ${
                step.id === currentStep
                  ? "bg-primary-light text-primary"
                  : step.completed
                  ? "text-text-secondary hover:bg-bg-faint"
                  : "text-text-muted hover:bg-bg-faint"
              }`}
            >
              {/* Step indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.completed
                    ? "bg-primary"
                    : step.id === currentStep
                    ? "border-2 border-primary"
                    : "border-2 border-border-medium"
                }`}
              >
                {step.completed ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold text-inherit">{step.id === currentStep ? "" : step.id}</span>
                )}
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10 bg-bg-faint">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Transparency Setup</h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Help donors understand exactly how their money will be used. This builds trust and increases donations.
          </p>

          {/* Fund allocation */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              How will funds be used?
            </label>
            <p className="text-xs text-text-muted mb-3">
              This percentage breakdown will be displayed (e.g., 60% medical expenses, 32% to surgery, 10% aftercare)
            </p>
            <textarea
              value={fundAllocation}
              onChange={(e) => setFundAllocation(e.target.value)}
              rows={3}
              className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                         resize-none text-text-primary bg-white"
              placeholder="Describe how funds will be allocated..."
            />
          </div>

          {/* Funding milestones */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Set funding milestones
            </label>

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-24">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                      <input
                        type="number"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                        className="w-full pl-6 pr-2 py-2.5 border border-border-medium rounded-md text-sm
                                   focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={milestone.label}
                      onChange={(e) => updateMilestone(index, "label", e.target.value)}
                      className="w-full px-3 py-2.5 border border-border-medium rounded-md text-sm
                                 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                      placeholder="Milestone description..."
                    />
                  </div>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="flex-shrink-0 p-2 text-text-muted hover:text-accent-red transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addMilestone}
              className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add another milestone
            </button>
          </div>

          {/* Insight callout */}
          <div className="bg-primary-light border border-primary/20 rounded-md p-4 mb-8 flex gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-primary-dark mb-0.5">Advice</p>
              <p className="text-sm text-primary/80 leading-relaxed">
                Adding specific milestones increases donor trust by 92%. The breakdown you&apos;ve provided contains clear donor milestones.
              </p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className="flex items-center gap-2 px-5 py-2.5 border border-border-medium rounded-md text-sm font-medium text-text-primary hover:bg-bg-gray transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
              Back
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Continue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
