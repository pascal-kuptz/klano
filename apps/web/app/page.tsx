export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center">
      <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-klano-surface border border-klano-border text-[12px] font-mono text-klano-text-2 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-klano-success" />
        Klano App · v0
      </span>

      <h1
        className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.025em] text-klano-text"
        style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}
      >
        klano <span className="italic text-klano-text-2">app</span>
      </h1>

      <p className="mt-6 max-w-xl text-klano-text-2 text-base leading-relaxed">
        Auth, Onboarding und Dashboard kommen ab v0.2.
      </p>
    </main>
  );
}
