"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Loader2, Play, AlertCircle } from "lucide-react"
import { isValidYouTubeUrl } from "@/lib/youtube"
import { SummarySkeleton } from "./summary-skeleton"
import { SummaryResultCard } from "./summary-result"

type Status = "idle" | "loading" | "done" | "error"

export function Summarizer() {
  const [url, setUrl] = useState("")
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [summary, setSummary] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmed = url.trim()
  const isEmpty = trimmed.length === 0
  const isValid = !isEmpty && isValidYouTubeUrl(trimmed)
  const showError = touched && !isEmpty && !isValid

  // Автофокус на поле ввода при загрузке страницы.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!isValid || status === "loading") return

    setStatus("loading")
    setSummary("")
    setErrorMessage("")

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || "Произошла ошибка при обработке видео.")
        setStatus("error")
        return
      }

      setSummary(data.summary || "")
      setStatus("done")
    } catch {
      setErrorMessage("Не удалось связаться с сервером. Попробуйте позже.")
      setStatus("error")
    }
  }

  function handleClear() {
    setSummary("")
    setStatus("idle")
    setUrl("")
    setTouched(false)
    setErrorMessage("")
    inputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`flex flex-col gap-2 rounded-xl border bg-card p-2 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring sm:flex-row sm:items-center ${
            showError ? "border-destructive/70" : "border-border"
          }`}
        >
          <div className="flex flex-1 items-center gap-2.5 px-2">
            <Play
              className={`h-4 w-4 shrink-0 ${
                showError ? "text-destructive" : "text-muted-foreground"
              }`}
            />
            <input
              ref={inputRef}
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setTouched(true)}
              disabled={status === "loading"}
              placeholder="Вставьте ссылку на YouTube (например, https://youtube.com/watch?v=...)"
              aria-label="Ссылка на YouTube-видео"
              aria-invalid={showError}
              className="w-full bg-transparent py-2.5 text-[15px] text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={!isValid || status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Анализирую…
              </>
            ) : (
              <>
                Сократить
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {showError && (
          <p className="mt-2 flex items-center gap-1.5 px-1 text-sm text-destructive animate-fade-in-up">
            <AlertCircle className="h-3.5 w-3.5" />
            Похоже, это не ссылка на YouTube. Проверьте адрес и попробуйте снова.
          </p>
        )}
      </form>

      <div className="mt-8">
        {status === "loading" && <SummarySkeleton />}
        {status === "done" && summary && (
          <SummaryResultCard summary={summary} onClear={handleClear} />
        )}
        {status === "error" && (
          <div className="animate-fade-in-up rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Ошибка</h3>
                <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Попробовать снова
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}