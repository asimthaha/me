import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProjectCard() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full h-48 rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
