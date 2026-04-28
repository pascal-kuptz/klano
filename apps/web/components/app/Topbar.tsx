interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, subtitle, action }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-klano-canvas/80 backdrop-blur border-b border-klano-border">
      <div className="px-6 md:px-10 py-5 flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-[22px] leading-[1.1] tracking-[-0.02em] text-klano-text"
            style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
