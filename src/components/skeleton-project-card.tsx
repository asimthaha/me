export const SkeletonProjectCard = () => {
  return (
    <article className="bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl overflow-hidden shadow-lg opacity-60">
      {/* Image skeleton */}
      <div className="h-64 bg-muted/50 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-muted/50 rounded animate-pulse" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
        </div>

        {/* Tech stack skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted/50 rounded-full animate-pulse w-16" />
          <div className="h-6 bg-muted/50 rounded-full animate-pulse w-20" />
          <div className="h-6 bg-muted/50 rounded-full animate-pulse w-14" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-muted/50 rounded animate-pulse flex-1" />
          <div className="h-9 bg-muted/50 rounded animate-pulse w-20" />
        </div>
      </div>
    </article>
  );
};
