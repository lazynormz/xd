import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { LoginForm } from '@/features/auth/components/login-form'
import type { AuthSession } from '@/features/auth/services/auth-session-storage'

interface LoginPageProps {
  onNavigateToRegister: () => void
  onSignedIn: (session: AuthSession) => void
}

export function LoginPage({
  onNavigateToRegister,
  onSignedIn,
}: LoginPageProps): ReactElement {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.94)_0%,_rgba(2,6,23,1)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_32px_120px_rgba(2,6,23,0.6)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="flex flex-col justify-between gap-8">
            <div className="inline-flex w-fit items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm font-medium text-amber-100">
              Private platform dashboard
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
                Welcome back.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Sign in to access the group dashboard, shared recommendations,
                ratings, clips, and the next wave of private community features.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Trusted space for your group
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Ratings, requests, and media in one place
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Built for authenticated access first
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.5)] md:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Log in
              </h2>
              <p className="text-sm leading-6 text-slate-300">
                Use your account details to continue into the private dashboard.
              </p>
            </div>

            <LoginForm onSignedIn={onSignedIn} />

            <div className="mt-6 border-t border-white/10 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl border-white/12 bg-white/5 px-6 text-sm font-semibold text-slate-100 hover:bg-white/10"
                onClick={onNavigateToRegister}
              >
                Create an account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
