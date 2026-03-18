"use client";

import { useState } from "react";

const STEPS = [
  { id: 1, label: "Cause Details" },
  { id: 2, label: "Story & Beneficiary" },
  { id: 3, label: "Fund Usage Plan" },
  { id: 4, label: "Milestones" },
  { id: 5, label: "Cover & Media" },
  { id: 6, label: "Review & Launch" },
];

interface Milestone {
  amount: string;
  label: string;
}

export function FundraiserWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("Support the Martinez Family After Fire");
  const [category, setCategory] = useState("Emergency");
  const [goalAmount, setGoalAmount] = useState("50000");
  const [location, setLocation] = useState("Atlanta, GA");
  const [story, setStory] = useState(
    "Our family lost our home in an unexpected fire and we are rebuilding from scratch. Donations will help us secure housing and replace essentials."
  );
  const [beneficiaryName, setBeneficiaryName] = useState("Martinez Family");
  const [beneficiaryRelationship, setBeneficiaryRelationship] = useState("Family");
  const [fundAllocation, setFundAllocation] = useState(
    "60% immediate support, 25% living expenses, 15% recovery costs"
  );
  const [milestones, setMilestones] = useState<Milestone[]>([
    { amount: "5000", label: "Immediate emergency support" },
    { amount: "20000", label: "Stabilize housing and bills" },
  ]);
  const [coverImageUrl, setCoverImageUrl] = useState(
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop"
  );
  const [mediaCaption, setMediaCaption] = useState("Family photo before the fire.");
  const [launchMessage, setLaunchMessage] = useState("");

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

  function goToPreviousStep() {
    setCurrentStep(Math.max(1, currentStep - 1));
  }

  function goToNextStep() {
    if (currentStep === STEPS.length) {
      setLaunchMessage("Fundraiser launched! You can now share it with donors.");
      return;
    }
    setCurrentStep(Math.min(STEPS.length, currentStep + 1));
  }

  function isCurrentStepValid() {
    if (currentStep === 1) {
      return Boolean(title.trim() && category.trim() && goalAmount.trim() && location.trim());
    }
    if (currentStep === 2) {
      return Boolean(story.trim() && beneficiaryName.trim() && beneficiaryRelationship.trim());
    }
    if (currentStep === 3) {
      return Boolean(fundAllocation.trim());
    }
    if (currentStep === 4) {
      return (
        milestones.length > 0 &&
        milestones.every((milestone) => milestone.amount.trim() && milestone.label.trim())
      );
    }
    if (currentStep === 5) {
      return Boolean(coverImageUrl.trim());
    }
    return true;
  }

  function renderStepContent() {
    if (currentStep === 1) {
      return (
        <>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Cause Details</h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Start with the essentials so donors quickly understand your fundraiser at a glance.
          </p>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Fundraiser title</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                placeholder="Give your fundraiser a clear title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                >
                  <option>Emergency</option>
                  <option>Medical</option>
                  <option>Education</option>
                  <option>Community</option>
                  <option>Animals</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Goal amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                  <input
                    type="number"
                    value={goalAmount}
                    onChange={(event) => setGoalAmount(event.target.value)}
                    className="w-full border border-border-medium rounded-md pl-6 pr-3 py-2.5 text-sm
                               focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                placeholder="City, State"
              />
            </div>
          </div>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Story & Beneficiary</h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Share what happened, who needs help, and why this support matters right now.
          </p>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Fundraiser story</label>
              <textarea
                value={story}
                onChange={(event) => setStory(event.target.value)}
                rows={6}
                className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                           resize-none text-text-primary bg-white"
                placeholder="Explain the situation and how support helps"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Beneficiary name</label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(event) => setBeneficiaryName(event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                  placeholder="Who is receiving support?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Your relationship
                </label>
                <select
                  value={beneficiaryRelationship}
                  onChange={(event) => setBeneficiaryRelationship(event.target.value)}
                  className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                >
                  <option>Family</option>
                  <option>Friend</option>
                  <option>Self</option>
                  <option>Community organizer</option>
                </select>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Fund Usage Plan</h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Show donors how funds support this specific cause. Clear plans build trust and increase giving.
          </p>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              How will funds be used?
            </label>
            <p className="text-xs text-text-muted mb-3">
              This breakdown appears on your fundraiser page (for example: medical bills, housing, transportation).
            </p>
            <textarea
              value={fundAllocation}
              onChange={(event) => setFundAllocation(event.target.value)}
              rows={3}
              className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                         resize-none text-text-primary bg-white"
              placeholder="Describe how funds will be allocated..."
            />
          </div>
        </>
      );
    }

    if (currentStep === 4) {
      return (
        <>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Milestones</h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Add milestone targets so donors can track progress and impact as your fundraiser grows.
          </p>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Set fundraising milestones
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
                        onChange={(event) => updateMilestone(index, "amount", event.target.value)}
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
                      onChange={(event) => updateMilestone(index, "label", event.target.value)}
                      className="w-full px-3 py-2.5 border border-border-medium rounded-md text-sm
                                 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                      placeholder="Milestone description..."
                    />
                  </div>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="flex-shrink-0 p-2 text-text-muted hover:text-accent-red transition-colors"
                    disabled={milestones.length === 1}
                    aria-label="Remove milestone"
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

          <div className="bg-primary-light border border-primary/20 rounded-md p-4 mb-8 flex gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B964" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-primary-dark mb-0.5">Advice</p>
              <p className="text-sm text-primary/80 leading-relaxed">
                Specific milestones usually improve donor confidence and can increase contributions.
              </p>
            </div>
          </div>
        </>
      );
    }

    if (currentStep === 5) {
      return (
        <>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Cover & Media</h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Add a strong image and caption to make your fundraiser easier to trust and share.
          </p>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Cover image URL</label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                placeholder="https://"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Image caption</label>
              <textarea
                rows={2}
                value={mediaCaption}
                onChange={(event) => setMediaCaption(event.target.value)}
                className="w-full border border-border-medium rounded-md px-3 py-2.5 text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                           resize-none text-text-primary bg-white"
                placeholder="Add context for the image"
              />
            </div>
            {coverImageUrl ? (
              <div className="rounded-md overflow-hidden border border-border-light bg-white">
                <img src={coverImageUrl} alt="Fundraiser cover preview" className="w-full h-56 object-cover" />
                {mediaCaption ? (
                  <p className="text-xs text-text-secondary px-3 py-2 border-t border-border-light">
                    {mediaCaption}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      );
    }

    return (
      <>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Review & Launch</h1>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          Confirm your details before publishing. You can still edit your fundraiser after launch.
        </p>

        {launchMessage ? (
          <div className="bg-primary-light border border-primary/20 rounded-md p-4 mb-6">
            <p className="text-sm font-semibold text-primary-dark">{launchMessage}</p>
          </div>
        ) : null}

        <div className="space-y-4 mb-8">
          <div className="bg-white border border-border-light rounded-md p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Title</p>
            <p className="text-sm text-text-primary font-medium">{title || "Untitled fundraiser"}</p>
          </div>
          <div className="bg-white border border-border-light rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Category</p>
              <p className="text-sm text-text-primary font-medium">{category}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Goal</p>
              <p className="text-sm text-text-primary font-medium">${goalAmount || "0"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Location</p>
              <p className="text-sm text-text-primary font-medium">{location}</p>
            </div>
          </div>
          <div className="bg-white border border-border-light rounded-md p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Story</p>
            <p className="text-sm text-text-secondary leading-relaxed">{story}</p>
          </div>
          <div className="bg-white border border-border-light rounded-md p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Fund usage</p>
            <p className="text-sm text-text-secondary leading-relaxed">{fundAllocation}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64 bg-white border-r border-border-light p-6 md:min-h-screen">
        <h2 className="font-bold text-text-primary text-sm mb-1">Start a Fundraiser</h2>
        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          Raise support for a specific cause in a few guided steps.
        </p>

        <nav className="space-y-1" aria-label="Fundraiser steps">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md ${
                step.id === currentStep
                  ? "bg-primary-light text-primary"
                  : step.id < currentStep
                  ? "text-text-secondary"
                  : "text-text-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.id < currentStep
                    ? "bg-primary"
                    : step.id === currentStep
                    ? "border-2 border-primary"
                    : "border-2 border-border-medium"
                }`}
              >
                {step.id < currentStep ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold text-inherit">{step.id === currentStep ? "" : step.id}</span>
                )}
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-10 bg-bg-faint">
        <div className="max-w-2xl">
          {renderStepContent()}

          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 border border-border-medium rounded-md text-sm font-medium text-text-primary hover:bg-bg-gray transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
              Back
            </button>
            <button
              onClick={goToNextStep}
              disabled={!isCurrentStepValid()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              {currentStep === STEPS.length ? "Launch fundraiser" : "Continue"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
