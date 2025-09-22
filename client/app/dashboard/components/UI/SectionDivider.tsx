"use client";

interface SectionDividerProps {
  label?: string;
  variant?: 'default' | 'subtle' | 'prominent';
}

export function SectionDivider({ label, variant = 'default' }: SectionDividerProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'subtle':
        return 'border-[var(--border-color)] opacity-30';
      case 'prominent':
        return 'border-[var(--color-secondary)] opacity-60';
      default:
        return 'border-[var(--border-color)] opacity-50';
    }
  };

  if (label) {
    return (
      <div className="flex items-center gap-4 my-8 w-full max-w-2xl">
        <div className={`flex-1 h-px border-t ${getVariantStyles()}`} />
        <span className="text-sm font-medium opacity-70 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)]">
          {label}
        </span>
        <div className={`flex-1 h-px border-t ${getVariantStyles()}`} />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl h-px border-t ${getVariantStyles()} my-6`} />
  );
}