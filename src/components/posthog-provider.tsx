"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

if (typeof window !== "undefined") {
  posthog.init("phc_BPJTEvxtF2h2A8g8TT3S8zMvmsFiBF5MKD62379h3VBw", {
    api_host: "https://eu.posthog.com",
    capture_pageview: false, // obsługujemy ręcznie przez PageViewTracker
    capture_pageleave: true,
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    if (url !== prev.current) {
      prev.current = url;
      ph.capture("$pageview", { $current_url: window.location.href });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
