import { LoaderCircle } from "lucide-react";
import { NeoCard } from "@/components/ui/NeoCard";

export function LoadingPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <NeoCard className="flex items-center gap-3 px-6 py-5">
        <LoaderCircle className="h-6 w-6 animate-spin" />
        <p className="font-bold">Loading…</p>
      </NeoCard>
    </div>
  );
}
