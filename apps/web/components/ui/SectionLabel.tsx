import { cn } from '@/lib/cn';

export function SectionLabel({
  num,
  label,
  className,
}: {
  num: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <span className="font-mono text-[11px] tracking-[0.04em] text-klano-text-3 tabular-nums">
        {num}
      </span>
      <span className="h-px w-6 bg-klano-border-strong" aria-hidden="true" />
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-2">
        {label}
      </span>
    </div>
  );
}
