"use client";
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com",
    capture_pageview: true,  
    capture_pageleave: true, 
  });
}

export default posthog;
