export function TrustSafety() {
  return (
    <div className="mt-6 pt-6 border-t border-border-light">
      <h2 className="text-base font-bold text-text-primary mb-3">Trust &amp; Safety</h2>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        GoSupportMe protects your donation. We guarantee you a full refund for up to a year in
        the rare case that funds aren't delivered to the right person.
      </p>

      <div className="space-y-2">
        {[
          "GoSupportMe Giving Guarantee",
          "Expert fundraising advice",
          "Secure payments &amp; fraud protection",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00B964"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span
              className="text-sm text-text-secondary"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </div>
        ))}
      </div>

      {/* Donation total */}
      <div className="mt-4 pt-4 border-t border-border-light">
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span className="text-xs text-text-muted">
            Created March 1, 2024
          </span>
          <span className="text-xs text-text-muted mx-1">·</span>
          <span className="text-xs bg-accent-red/10 text-accent-red font-medium px-1.5 py-0.5 rounded-sm">
            Emergency
          </span>
          <span className="text-xs bg-accent-yellow/20 text-accent-orange font-medium px-1.5 py-0.5 rounded-sm ml-1">
            Tax deductible
          </span>
        </div>
      </div>
    </div>
  );
}
