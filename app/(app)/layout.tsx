import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh">
      <AppShell>{children}</AppShell>
    </main>
  );
}
