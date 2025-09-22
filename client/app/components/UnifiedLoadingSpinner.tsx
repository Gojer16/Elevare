"use client";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";

interface UnifiedLoadingSpinnerProps {
  /** Loading message to display */
  message?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Display variant */
  variant?: 'spinner' | 'dots' | 'pulse' | 'card';
  /** Whether to show as fullscreen overlay */
  fullscreen?: boolean;
  /** Custom className for container */
  className?: string;
  /** Whether to animate entrance */
  animate?: boolean;
}

export function UnifiedLoadingSpinner({
  message = "Loading...",
  size = 'md',
  variant = 'spinner',
  fullscreen = false,
  className = '',
  animate = true
}: UnifiedLoadingSpinnerProps) {
  // Safely get theme with fallback
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || 'modern';

  // Size configurations
  const sizeConfig = {
    xs: { spinner: 'h-4 w-4', text: 'text-xs', gap: 'gap-2' },
    sm: { spinner: 'h-6 w-6', text: 'text-sm', gap: 'gap-2' },
    md: { spinner: 'h-8 w-8', text: 'text-base', gap: 'gap-3' },
    lg: { spinner: 'h-12 w-12', text: 'text-lg', gap: 'gap-4' },
    xl: { spinner: 'h-16 w-16', text: 'text-xl', gap: 'gap-4' }
  };

  // Theme-based styling
  const themeStyles = {
    modern: {
      container: 'bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-secondary)]',
      text: 'text-[var(--color-foreground)]',
      spinner: 'text-[var(--color-primary)]'
    },
    minimal: {
      container: 'bg-[var(--card-bg)]',
      text: 'text-[var(--color-foreground)]',
      spinner: 'text-[var(--color-primary)]'
    }
  };

  const config = sizeConfig[size];
  const styles = themeStyles[theme];

  // Spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`flex ${config.gap}`}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${config.spinner.replace('h-', 'h-2 w-2').replace('w-', '')} bg-current rounded-full`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${config.spinner} bg-current rounded-full`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        );

      case 'card':
        return (
          <svg className={`animate-spin ${config.spinner}`} viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );

      default: // 'spinner'
        return (
          <svg
            className={`animate-spin ${config.spinner}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${config.gap} ${styles.text} ${className}`}>
      <div className={styles.spinner}>
        {renderSpinner()}
      </div>
      {message && (
        <p className={`${config.text} opacity-80 font-medium`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    const MotionDiv = animate ? motion.div : 'div';
    const motionProps = animate ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    } : {};

    return (
      <MotionDiv
        {...motionProps}
        className={`fixed inset-0 z-50 flex items-center justify-center ${styles.container} backdrop-blur-sm`}
      >
        {content}
      </MotionDiv>
    );
  }

  if (variant === 'card') {
    const MotionDiv = animate ? motion.div : 'div';
    const motionProps = animate ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    } : {};

    return (
      <MotionDiv
        {...motionProps}
        className={`rounded-2xl border border-[var(--border-color)] ${styles.container} shadow-xl p-8 text-center`}
      >
        {content}
      </MotionDiv>
    );
  }

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return <div>{content}</div>;
}

// Convenience components for common use cases
export const LoadingSpinner = UnifiedLoadingSpinner;

export const InlineSpinner = (props: Omit<UnifiedLoadingSpinnerProps, 'size' | 'variant'>) => (
  <UnifiedLoadingSpinner {...props} size="xs" variant="spinner" animate={false} />
);

export const ButtonSpinner = (props: Omit<UnifiedLoadingSpinnerProps, 'size' | 'variant' | 'message'>) => (
  <UnifiedLoadingSpinner {...props} size="sm" variant="spinner" message="" animate={false} />
);

export const CardSpinner = (props: Omit<UnifiedLoadingSpinnerProps, 'variant'>) => (
  <UnifiedLoadingSpinner {...props} variant="card" />
);

export const FullscreenSpinner = (props: Omit<UnifiedLoadingSpinnerProps, 'fullscreen'>) => (
  <UnifiedLoadingSpinner {...props} fullscreen={true} />
);

export const DotsSpinner = (props: Omit<UnifiedLoadingSpinnerProps, 'variant'>) => (
  <UnifiedLoadingSpinner {...props} variant="dots" />
);

export default UnifiedLoadingSpinner;