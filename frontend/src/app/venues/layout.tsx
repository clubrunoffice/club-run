import { AppShell } from '@/components/layout/AppShell';

export default function VenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
} 