import type { ReactElement } from 'react'

import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage(): ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.22),_transparent_32%),linear-gradient(180deg,_#fffaf0_0%,_#f8efe1_52%,_#efe0cb_100%)] text-stone-950">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,_rgba(120,53,15,0.14),_transparent_58%)]"
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-10 rounded-[2rem] border border-stone-900/10 bg-white/70 p-8 shadow-[0_30px_80px_rgba(120,53,15,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="flex flex-col justify-between gap-8">
            <div className="inline-flex w-fit items-center rounded-full border border-amber-950/10 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900">
              Private platform dashboard
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                Welcome back.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                Sign in to access the group dashboard, shared recommendations,
                ratings, clips, and the next wave of private community features.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-stone-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Trusted space for your group
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Ratings, requests, and media in one place
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                Built for authenticated access first
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_40px_rgba(120,53,15,0.08)] md:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                Log in
              </h2>
              <p className="text-sm leading-6 text-stone-600">
                Use your account details to continue into the private dashboard.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  )
}
