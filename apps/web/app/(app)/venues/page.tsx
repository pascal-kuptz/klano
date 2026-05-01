import { Topbar } from '@/components/app/Topbar';
import { Button } from '@/components/ui/Button';
import { VenuesView } from '@/components/app/VenuesView';
import { STATIC_VENUES } from '@/lib/onboarding/venues-static';

export const metadata = { title: 'Venues' };

export default function VenuesPage() {
  return (
    <>
      <Topbar
        title="Venues"
        subtitle={`${STATIC_VENUES.length} Treffer · DACH`}
        action={<Button size="sm" variant="secondary">Filter</Button>}
      />
      <main className="px-6 md:px-10 py-10 max-w-[1280px]">
        <VenuesView />
      </main>
    </>
  );
}
