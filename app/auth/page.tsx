"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Mode = "sign-in" | "sign-up"

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!active) return
      setAccessToken(data.session?.access_token ?? null)
    })
    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token ?? null)
    })
    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleAuth = async () => {
    setStatus("loading")
    setMessage(null)
    try {
      if (mode === "sign-in") {
        const { error } = await supabaseBrowser.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setStatus("success")
        setMessage("Signed in successfully.")
      } else {
        const { error } = await supabaseBrowser.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setStatus("success")
        setMessage("Account created. Check your email if confirmation is required.")
      }
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Authentication failed.")
    }
  }

  const handleSignOut = async () => {
    setStatus("loading")
    setMessage(null)
    const { error } = await supabaseBrowser.auth.signOut()
    if (error) {
      setStatus("error")
      setMessage(error.message)
      return
    }
    setStatus("success")
    setMessage("Signed out.")
  }

  const copyToken = async () => {
    if (!accessToken) return
    await navigator.clipboard.writeText(accessToken)
    setMessage("Access token copied to clipboard.")
    setStatus("success")
  }

  const isFormValid = email.trim().length > 0 && password.trim().length >= 6

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Sign in</CardTitle>
              <CardDescription>
                Use this to obtain a valid session token for API testing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("sign-in")}
                  className={mode === "sign-in" ? "bg-white text-black" : "bg-transparent text-foreground/70"}
                >
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("sign-up")}
                  className={mode === "sign-up" ? "bg-white text-black" : "bg-transparent text-foreground/70"}
                >
                  Create account
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="sm:flex-1 bg-white text-black hover:bg-white/80"
                  disabled={!isFormValid || status === "loading"}
                  onClick={handleAuth}
                >
                  {mode === "sign-in" ? "Sign in" : "Create account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1 bg-transparent text-foreground/70"
                  onClick={handleSignOut}
                  disabled={status === "loading"}
                >
                  Sign out
                </Button>
              </div>

              {message && (
                <div
                  className={`rounded-md border px-3 py-2 text-sm ${
                    status === "error"
                      ? "border-border/70 bg-secondary/40 text-foreground"
                      : "border-border/50 bg-secondary/20 text-foreground"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="rounded-md border border-border/60 bg-background/60 px-4 py-3">
                <p className="text-xs text-muted-foreground mb-2">Access Token</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <code className="flex-1 break-all text-xs text-foreground/80">
                    {accessToken ?? "No active session"}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!accessToken}
                    onClick={copyToken}
                  >
                    Copy token
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  )
}
