import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { RegisterForm } from '@/features/auth/components/register-form'
import type { AuthSession } from '@/features/auth/services/auth-session-storage'

interface RegisterPageProps {
  onNavigateToLogin: () => void
  onRegistered: (session: AuthSession) => void
}

export function RegisterPage({
  onNavigateToLogin,
  onRegistered,
}: RegisterPageProps): ReactElement {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.94)_0%,_rgba(2,6,23,1)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute right-16 top-24 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_32px_120px_rgba(2,6,23,0.6)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="flex flex-col justify-between gap-8">
            <div className="inline-flex w-fit items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm font-medium text-amber-100">
              Private platform onboarding
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
                Create your account.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Join the private dashboard and start using shared ratings,
                requests, and future group features.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Private access from the start
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Immediate sign-in after registration
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Ready for recommendations and ratings
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.5)] md:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Register
              </h2>
              <p className="text-sm leading-6 text-slate-300">
                Create a new account to continue into the private dashboard.
              </p>
            </div>

            <RegisterForm onRegistered={onRegistered} />

            <div className="mt-6 border-t border-white/10 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl border-white/12 bg-white/5 px-6 text-sm font-semibold text-slate-100 hover:bg-white/10"
                onClick={onNavigateToLogin}
              >
                Back to log in
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
