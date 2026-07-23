"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Loader2, Play, AlertCircle, Coins } from "lucide-react"
import { isValidYouTubeUrl } from "@/lib/youtube"
import { SummarySkeleton } from "./summary-skeleton"
import { SummaryResultCard } from "./summary-result"
import { useAuth } from "@/contexts/auth-context"
import { AuthForm } from "@/components/auth-form"
import { supabase } from "@/lib/supabase"

type Status = "idle" | "loading" | "done" | "error"

export function Summarizer() {
  const [url, setUrl] = useState("")
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [summary, setSummary] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showAuth, setShowAuth] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user, loading, credits, refreshCredits } = useAuth()

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

    // Check if user is authenticated
    if (!user) {
      setShowAuth(true)
      return
    }

    setStatus("loading")
    setSummary("")
    setErrorMessage("")

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setErrorMessage("Сессия истекла. Пожалуйста, войдите снова.")
        setStatus("error")
        setShowAuth(true)
        return
      }

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
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
      
      // Refresh credits after successful summary
      await refreshCredits()
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

  // Show auth form if user is not logged in
  if (showAuth || !user) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Добро пожаловать!</h2>
          <p className="text-muted-foreground">
            Войдите или зарегистрируйтесь, чтобы получить доступ к сервису. 
            Новые пользователи получают 5 бесплатных кредитов!
          </p>
        </div>
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Credits display */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium">Ваши кредиты:</span>
          <span className="text-lg font-bold text-primary">{credits}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          -1 кредит за каждое видео
        </div>
      </div>

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