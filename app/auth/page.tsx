'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { cn } from '@/lib/utils';

type Mode = 'sign-in' | 'sign-up';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [envWarning, setEnvWarning] = useState<string | null>(null);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    const getProjectRefFromUrl = (url: string) => {
      try {
        const host = new URL(url).hostname;
        return host.split('.')[0] ?? null;
      } catch {
        return null;
      }
    };
    const getProjectRefFromAnonKey = (key: string) => {
      try {
        const payload = key.split('.')[1];
        if (!payload) return null;
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const data = JSON.parse(json) as { ref?: string };
        return data.ref ?? null;
      } catch {
        return null;
      }
    };
    const urlRef = getProjectRefFromUrl(supabaseUrl);
    const keyRef = getProjectRefFromAnonKey(supabaseAnonKey);
    if (urlRef && keyRef && urlRef !== keyRef) {
      setEnvWarning(
        `Supabase URL project ref (${urlRef}) does not match anon key ref (${keyRef}). Update NEXT_PUBLIC_SUPABASE_ANON_KEY to match NEXT_PUBLIC_SUPABASE_URL.`,
      );
    } else if (!supabaseUrl || !supabaseAnonKey) {
      setEnvWarning('Missing Supabase env vars in NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    } else {
      setEnvWarning(null);
    }

    let active = true;
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAccessToken(data.session?.access_token ?? null);
    });
    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setAccessToken(session?.access_token ?? null);
      },
    );
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async () => {
    setStatus('loading');
    setMessage(null);
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const emailRedirectTo = `${window.location.origin}/auth`;
      if (useMagicLink) {
        const { error } = await supabaseBrowser.auth.signInWithOtp({
          email: trimmedEmail,
          options: {
            emailRedirectTo,
            shouldCreateUser: mode === 'sign-up',
          },
        });
        if (error) throw error;
        setStatus('success');
        setMessage(
          mode === 'sign-up'
            ? 'Magic link sent. Check your email to finish creating your account.'
            : 'Magic link sent. Check your email to sign in.',
        );
      } else if (mode === 'sign-in') {
        const { error } = await supabaseBrowser.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) throw error;
        setStatus('success');
        setMessage('Signed in successfully.');
      } else {
        const { data, error } = await supabaseBrowser.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            emailRedirectTo,
          },
        });
        if (error) throw error;
        setStatus('success');
        if (data?.session) {
          setMessage('Account created and signed in.');
        } else {
          setMessage('Account created. Check your email to confirm your account.');
        }
      }
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : 'Authentication failed.';
      const friendlyMessage = rawMessage.includes('Invalid API key')
        ? 'Invalid Supabase API key. Update NEXT_PUBLIC_SUPABASE_ANON_KEY to the anon key for this Supabase project and restart the dev server.'
        : rawMessage;
      setStatus('error');
      setMessage(friendlyMessage);
    }
  };

  const handleSignOut = async () => {
    setStatus('loading');
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signOut();
    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }
    setStatus('success');
    setMessage('Signed out.');
  };

  const copyToken = async () => {
    if (!accessToken) return;
    await navigator.clipboard.writeText(accessToken);
    setMessage('Access token copied to clipboard.');
    setStatus('success');
  };

  const isFormValid = email.trim().length > 0 && password.trim().length >= 6;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Access</p>
              <h1 className="text-2xl font-display text-white">Sign in</h1>
              <p className="text-sm text-white/60">
                Use this to obtain a valid session token for API testing.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode('sign-in')}
                className={
                  mode === 'sign-in'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white/70'
                }
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode('sign-up')}
                className={
                  mode === 'sign-up'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white/70'
                }
              >
                Create account
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/70">
              <input
                id="magic-link"
                type="checkbox"
                checked={useMagicLink}
                onChange={(event) => setUseMagicLink(event.target.checked)}
              />
              <Label htmlFor="magic-link" className="text-white/70">
                Use email link (no password)
              </Label>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent border-0 px-0 text-white/80 placeholder:text-white/40"
                />
              </div>
              {!useMagicLink && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/70">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent border-0 px-0 text-white/80 placeholder:text-white/40"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="sm:flex-1 bg-white text-black hover:bg-white/80"
                disabled={
                  status === 'loading' ||
                  (useMagicLink
                    ? email.trim().length === 0
                    : !isFormValid)
                }
                onClick={handleAuth}
              >
                {mode === 'sign-in'
                  ? useMagicLink
                    ? 'Send magic link'
                    : 'Sign in'
                  : useMagicLink
                    ? 'Send signup link'
                    : 'Create account'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:flex-1 bg-transparent text-white/70"
                onClick={handleSignOut}
                disabled={status === 'loading'}
              >
                Sign out
              </Button>
            </div>

            {envWarning && (
              <div
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {envWarning}
              </div>
            )}

            {message && (
              <div
                className={cn(
                  'rounded-md border px-3 py-2 text-sm',
                  status === 'error' &&
                    'border-destructive/40 bg-destructive/10 text-destructive',
                  status === 'success' &&
                    'border-emerald-500/40 bg-emerald-500/10 text-emerald-600',
                  status === 'loading' && 'border-border bg-muted/40 text-foreground',
                  status === 'idle' && 'border-border bg-muted/40 text-foreground',
                )}
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Access Token
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <code className="flex-1 break-all text-xs text-white/60">
                  {accessToken ?? 'No active session'}
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
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
