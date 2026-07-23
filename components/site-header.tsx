'use client'

import { Sparkles, LogOut, User } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { user, credits, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Сводка
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline text-muted-foreground">
                  {user.email}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  <span>💰</span>
                  <span>{credits}</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8"
                title="Выйти"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
