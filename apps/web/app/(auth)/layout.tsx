import { Logo } from '@/components/ui/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 md:px-10 md:py-8">
        <Logo href="/" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="px-6 py-6 md:px-10 md:py-8 font-mono text-[11px] tracking-[0.08em] uppercase text-klano-text-3">
        klano · v0
      </footer>
    </div>
  );
}
