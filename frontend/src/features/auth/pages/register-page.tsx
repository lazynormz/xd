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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.18),_transparent_32%),linear-gradient(180deg,_#fffaf0_0%,_#f8efe1_52%,_#efe0cb_100%)] text-stone-950">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,_rgba(146,64,14,0.14),_transparent_58%)]"
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-10 rounded-[2rem] border border-stone-900/10 bg-white/70 p-8 shadow-[0_30px_80px_rgba(120,53,15,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="flex flex-col justify-between gap-8">
            <div className="inline-flex w-fit items-center rounded-full border border-amber-950/10 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900">
              Private platform onboarding
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                Create your account.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                Join the private dashboard and start using shared ratings,
                requests, and future group features.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-stone-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Private access from the start
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Immediate sign-in after registration
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Ready for recommendations and ratings
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(120,53,15,0.08)] md:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                Register
              </h2>
              <p className="text-sm leading-6 text-stone-600">
                Create a new account to continue into the private dashboard.
              </p>
            </div>

            <RegisterForm onRegistered={onRegistered} />

            <div className="mt-6 border-t border-stone-200 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl border-stone-300 bg-white px-6 text-sm font-semibold text-stone-950 hover:bg-stone-100"
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
