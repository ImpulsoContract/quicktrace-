"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";

// Sub-component to use search parameters
function UTMTrackerInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
      "msclkid",
      "ttclid",
      "ref"
    ];

    let hasMarketingData = false;
    const currentData = {};

    utmKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        currentData[key] = value;
        hasMarketingData = true;
      }
    });

    if (hasMarketingData) {
      // 1. Persist in localStorage (existing logic)
      const storageData = {
        data: currentData,
        timestamp: Date.now()
      };
      localStorage.setItem("qt_marketing_data", JSON.stringify(storageData));

      // 2. Persist in Cookies (to ensure registration page can find them)
      utmKeys.forEach((key) => {
        const value = currentData[key];
        if (value) {
          const days = 30;
          const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
          document.cookie = `qt_${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
        }
      });

      console.log("[UTMTracker] Persisted marketing data in LocalStorage and Cookies:", currentData);
    }
  }, [searchParams, pathname]);

  return null;
}

// Wrapper with Suspense because useSearchParams requires it in some Next.js versions/builds
export default function UTMTracker() {
  return (
    <Suspense fallback={null}>
      <UTMTrackerInner />
    </Suspense>
  );
}
