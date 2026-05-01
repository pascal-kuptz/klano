import { Topbar } from '@/components/app/Topbar';
import { ComposeFlow } from '@/components/app/ComposeFlow';

export const metadata = { title: 'Neue Outreach' };

export default function NewBookingPage() {
  return (
    <>
      <Topbar title="Neue Outreach" subtitle="Klano draftet — du sendest" />
      <main className="px-6 md:px-10 py-10 max-w-[1200px] w-full">
        <ComposeFlow />
      </main>
    </>
  );
}
