"use client";

import { useEffect, useRef } from "react";
import { recordPageView } from "@/lib/api";

export type PageViewType = "fundraiser" | "community" | "profile";

export function PageViewReporter({ pageType }: { pageType: PageViewType }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void recordPageView(pageType);
  }, [pageType]);

  return null;
}
