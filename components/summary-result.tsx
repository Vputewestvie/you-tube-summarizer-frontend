"use client"

import { useState } from "react"
import { Check, Copy, RotateCcw, Clock } from "lucide-react"
import type { SummaryResult } from "@/lib/mock-summary"

export function SummaryResultCard({
  result,
  onClear,
}: {
  result: SummaryResult
  onClear: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const text = `${result.tldr}\n\nКлючевые выводы:\n${result.keyPoints
      .map((p) => `• ${p}`)
      .join("\n")}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Игнорируем — буфер обмена может быть недоступен.
    }
  }

  return (
    <article className="animate-fade-in-up rounded-2xl border border-border bg-card p-5 sm:p-6">
      {/* Мини-карточка видео */}
      <div className="mb-6 flex items-center gap-3">
        {result.video.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.video.thumbnail || "/placeholder.svg"}
            alt=""
            className="h-16 w-28 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="h-16 w-28 shrink-0 rounded-lg bg-muted" />
        )}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium leading-snug">
            {result.video.title}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{result.video.channel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {result.video.duration}
            </span>
          </p>
        </div>
      </div>

      {/* TL;DR */}
      <div className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Краткая суть
        </h3>
        <p className="text-base font-medium leading-relaxed text-pretty">
          {result.tldr}
        </p>
      </div>

      {/* Ключевые выводы */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ключевые выводы
        </h3>
        <ul className="space-y-2.5">
          {result.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-[15px] text-pretty">{point}</span>
            </li>
          ))}
        </ul>
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
