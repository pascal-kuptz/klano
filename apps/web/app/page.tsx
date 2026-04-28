import { redirect } from 'next/navigation';

// Root → dashboard for now. v0.2 will gate behind auth and redirect to /sign-in if not signed in.
export default function RootPage() {
  redirect('/dashboard');
}
