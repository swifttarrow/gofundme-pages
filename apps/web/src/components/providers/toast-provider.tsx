"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "celebration";
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const CONFETTI_PIECES = Array.from({ length: 28 }, (_, index) => index);
const CONFETTI_COLORS = ["#00B964", "#22C55E", "#FACC15", "#FB7185", "#60A5FA", "#A78BFA"];

function CelebrationConfetti({ toastId }: { toastId: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {CONFETTI_PIECES.map((piece) => {
        const left = 8 + ((piece * 83 + toastId) % 84);
        const size = 6 + (piece % 4);
        const delay = piece * 28;
        const duration = 1100 + (piece % 5) * 140;
        const translateX = ((piece % 7) - 3) * 28;
        const rotate = (piece % 2 === 0 ? 1 : -1) * (80 + piece * 11);

        return (
          <span
            key={piece}
            className="absolute -top-6 rounded-sm opacity-0"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 1.6}px`,
              backgroundColor: CONFETTI_COLORS[piece % CONFETTI_COLORS.length],
              animation: `toast-confetti-burst ${duration}ms ease-out ${delay}ms forwards`,
              transform: `translate3d(0, 0, 0) rotate(0deg)`,
              ["--confetti-x" as string]: `${translateX}px`,
              ["--confetti-y" as string]: `${170 + piece * 10}px`,
              ["--confetti-r" as string]: `${rotate}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const celebrationToast = toasts.find((toast) => toast.variant === "celebration");
  const stackedToasts = toasts.filter((toast) => toast.variant !== "celebration");

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, ...toast }]);
  }, []);

  useEffect(() => {
    if (stackedToasts.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      dismissToast(stackedToasts[0].id);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [dismissToast, stackedToasts]);

  useEffect(() => {
    if (!celebrationToast) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissToast(celebrationToast.id);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [celebrationToast, dismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {celebrationToast ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => dismissToast(celebrationToast.id)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`celebration-title-${celebrationToast.id}`}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-white px-6 pb-6 pt-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.35)]"
          >
            <CelebrationConfetti toastId={celebrationToast.id} />
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                  <path d="M17 5h3v2a4 4 0 0 1-4 4h-1" />
                  <path d="M7 5H4v2a4 4 0 0 0 4 4h1" />
                </svg>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Achievement unlocked
              </p>
              <h2
                id={`celebration-title-${celebrationToast.id}`}
                className="mt-2 text-2xl font-bold text-text-primary"
              >
                {celebrationToast.title}
              </h2>
              {celebrationToast.description ? (
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {celebrationToast.description}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => dismissToast(celebrationToast.id)}
                className="mt-6 inline-flex min-w-36 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Nice
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {stackedToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden rounded-xl border border-primary/20 bg-white px-4 py-3 shadow-[0_12px_32px_rgba(16,24,40,0.14)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-text-muted transition-colors hover:text-text-primary"
                aria-label="Dismiss toast"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes toast-confetti-burst {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0.7);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--confetti-x), var(--confetti-y), 0)
              rotate(var(--confetti-r)) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
