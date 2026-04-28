import { Sidebar } from '@/components/app/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-klano-canvas">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
