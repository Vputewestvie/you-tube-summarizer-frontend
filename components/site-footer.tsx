import { Link2 } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>Сводка — суть видео за пару секунд.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Link2 className="h-4 w-4" />
            GitHub
          </a>
          <span aria-hidden="true" className="text-border">
            |
          </span>
          <span>Хостинг на Vercel</span>
        </div>
      </div>
    </footer>
  )
}
