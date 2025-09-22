"use client";
/**
 * Client-side feature gating components.
 *
 * Provides:
 * - `FeatureGate`: Conditionally renders children based on feature access, with optional fallback or upgrade CTA.
 * - `withFeatureGate`: Higher-order component to secure any component behind a feature.
 * - `DevOnly`: Convenience wrapper that renders only for developer users.
 */
import { ReactNode } from "react";
import { useFeatureAccess } from "@/app/hooks/useFeatureAccess";
import { Feature } from "@/lib/features";
import { UpgradeCTA } from "./UpgradeCTA";

/**
 * Props for `FeatureGate`.
 *
 * - `feature`: The feature key to check access for.
 * - `children`: Content to render when access is granted.
 * - `fallback`: Optional content when access is denied (overrides upgrade CTA).
 * - `showUpgrade`: Whether to show an upgrade CTA when access is denied and no fallback is provided (default: true).
 */
interface FeatureGateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

/**
 * Component that conditionally renders content based on feature access.
 */
export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: FeatureGateProps) {
  const { hasAccess } = useFeatureAccess();
  
  if (hasAccess(feature)) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  if (showUpgrade) {
    return <UpgradeCTA feature={feature} />;
  }
  
  return null;
}

/**
 * Higher-order component for feature gating.
 *
 * Wraps a component so that it only renders when the user has access to `feature`.
 * Optionally accepts a `fallback` to render when access is denied; otherwise uses `UpgradeCTA`.
 */
export function withFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  feature: Feature,
  fallback?: ReactNode
) {
  return function FeatureGatedComponent(props: P) {
    return (
      <FeatureGate feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureGate>
    );
  };
}

/**
 * Developer-only component wrapper.
 *
 * Renders children only if `useFeatureAccess().isDeveloper` is true.
 */
export function DevOnly({ children }: { children: ReactNode }) {
  const { isDeveloper } = useFeatureAccess();
  
  if (!isDeveloper) return null;
  
  return <>{children}</>;
}