import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

function DashboardLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          Loading Earth Events Dashboard...
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardShell />
    </Suspense>
  );
}
