export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center">
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-klano-fog mb-8 inline-flex items-center gap-3">
        <span className="w-6 h-px bg-klano-acid" />
        Klano App · v0
      </span>

      <h1
        className="font-serif font-extrabold text-[clamp(3rem,11vw,7.5rem)] leading-[0.92] tracking-[-0.04em] max-w-5xl"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30, 'WONK' 1" }}
      >
        the digital{' '}
        <em
          className="italic font-normal"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}
        >
          bandmate
        </em>
        <span className="text-klano-coral">.</span>
      </h1>

      <p className="mt-10 max-w-xl text-klano-bone text-lg leading-relaxed">
        Auth, Onboarding und Dashboard kommen ab v0.2.
      </p>
    </main>
  );
}
