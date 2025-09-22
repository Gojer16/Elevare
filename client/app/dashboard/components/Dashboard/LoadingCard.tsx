"use client";
import { CardSpinner } from "@/app/components/UnifiedLoadingSpinner";

export function LoadingCard() {
  return <CardSpinner message="Loading your day…" size="md" />;
}