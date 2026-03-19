"use client";

import { Badge, evaluateBadges } from "@/lib/api";
import { emitAppDataRefresh } from "@/lib/client-events";

export async function evaluateBadgesAndToast(
  userId: string,
  showToast: (toast: { title: string; description?: string }) => void
): Promise<Badge[]> {
  const result = await evaluateBadges(userId);

  for (const badge of result.awarded) {
    showToast({
      title: `Badge earned: ${badge.label}`,
      description: badge.description,
    });
  }

  if (result.awarded.length > 0) {
    emitAppDataRefresh();
  }

  return result.awarded;
}
