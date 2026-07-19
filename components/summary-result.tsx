"use client"

import { useState } from "react"
import { Check, Copy, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"

export function SummaryResultCard({
  summary,
  onClear,
}: {
  summary: string
  onClear: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Игнорируем — буфер обмена может быть недоступен.
    }
  }

  return (
    <article className="animate-fade-in-up rounded-2xl border border-border bg-card p-5 sm:p-6">
      {/* Markdown-сводка */}
      <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children, ...props }) => (
              <h2 className="mb-3 mt-6 text-lg font-semibold first:mt-0" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="mb-2 mt-5 text-base font-semibold" {...props}>
                {children}
              </h3>
            ),
            p: ({ children, ...props }) => (
              <p className="mb-3 text-[15px] leading-relaxed text-pretty" {...props}>
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul className="mb-4 space-y-2" {...props}>
                {children}
              </ul>
            ),
            li: ({ children, ...props }) => (
              <li className="flex gap-3 leading-relaxed" {...props}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-[15px] text-pretty">{children}</span>
              </li>
            ),
            strong: ({ children, ...props }) => (
              <strong className="font-semibold" {...props}>
                {children}
              </strong>
            ),
          }}
        >
          {summary}
        </ReactMarkdown>
      </div>

      {/* Панель утилит */}
      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              Скопировано!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Скопировать
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Очистить
        </button>
      </div>
    </article>
  )
}