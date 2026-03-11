/**
 * Coming Soon skeleton placeholder.
 * Used for pages with template filler content that has been stripped (e.g., Travel Insurance).
 */
export function ComingSoon({ label = "Content coming soon" }: { label?: string }) {
  return (
    <div className="mx-auto max-w-[780px] py-16">
      {/* Skeleton blocks */}
      <div className="space-y-4">
        <div className="h-4 w-3/4 rounded-full bg-primary/[0.04] animate-skeleton-pulse" />
        <div className="h-4 w-full rounded-full bg-primary/[0.04] animate-skeleton-pulse [animation-delay:200ms]" />
        <div className="h-4 w-5/6 rounded-full bg-primary/[0.04] animate-skeleton-pulse [animation-delay:400ms]" />
        <div className="h-4 w-2/3 rounded-full bg-primary/[0.04] animate-skeleton-pulse [animation-delay:600ms]" />
      </div>

      <p className="mt-8 text-center text-sm text-primary/30 tracking-wide">{label}</p>
    </div>
  );
}
