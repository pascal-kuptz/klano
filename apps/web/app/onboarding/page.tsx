import { WizardProvider } from '@/components/onboarding/WizardProvider';
import { Wizard } from '@/components/onboarding/Wizard';

export default function OnboardingPage() {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
}
