export function SummarySkeleton({ statusText }: { statusText: string }) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl border border-border bg-card p-5 sm:p-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="tabular-nums">{statusText}</span>
      </div>

      {/* Мини-карточка видео */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-16 w-28 shrink-0 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* TL;DR */}
      <div className="mb-6 space-y-2.5">
        <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
      </div>

      {/* Ключевые выводы */}
      <div className="space-y-3">
        {[90, 75, 82, 68].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-muted" />
            <div
              className="h-3 animate-pulse rounded bg-muted"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
