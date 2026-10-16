export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  const skeletons = {
    card: () => (
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)]">
        <div className="animate-shimmer h-5 w-3/4 rounded-[var(--radius-sm)] mb-3" />
        <div className="animate-shimmer h-4 w-1/2 rounded-[var(--radius-sm)] mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="animate-shimmer h-6 w-16 rounded-[var(--radius-full)]" />
          <div className="animate-shimmer h-6 w-20 rounded-[var(--radius-full)]" />
          <div className="animate-shimmer h-6 w-14 rounded-[var(--radius-full)]" />
        </div>
        <div className="flex justify-between items-center">
          <div className="animate-shimmer h-4 w-24 rounded-[var(--radius-sm)]" />
          <div className="animate-shimmer h-9 w-20 rounded-[var(--radius-md)]" />
        </div>
      </div>
    ),
    table: () => (
      <div className="flex items-center gap-4 py-4 px-6 border-b border-[var(--border-color)]">
        <div className="animate-shimmer h-4 w-1/4 rounded-[var(--radius-sm)]" />
        <div className="animate-shimmer h-4 w-1/5 rounded-[var(--radius-sm)]" />
        <div className="animate-shimmer h-4 w-1/6 rounded-[var(--radius-sm)]" />
        <div className="animate-shimmer h-6 w-20 rounded-[var(--radius-full)]" />
      </div>
    ),
    stat: () => (
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <div className="animate-shimmer h-12 w-12 rounded-[var(--radius-md)]" />
          <div>
            <div className="animate-shimmer h-3 w-20 rounded-[var(--radius-sm)] mb-2" />
            <div className="animate-shimmer h-6 w-12 rounded-[var(--radius-sm)]" />
          </div>
        </div>
      </div>
    ),
  };

  const Skeleton = skeletons[type] || skeletons.card;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
}
