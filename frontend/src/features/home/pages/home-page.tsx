import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'

interface HomePageProps {
  emailAddress: string
  onLogOut: () => void
}

export function HomePage({
  emailAddress,
  onLogOut,
}: HomePageProps): ReactElement {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_26%),linear-gradient(180deg,_rgba(15,23,42,0.94)_0%,_rgba(2,6,23,1)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_32px_120px_rgba(2,6,23,0.6)] backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="inline-flex w-fit items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
              Authenticated dashboard
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
                Welcome, {emailAddress}.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Your session is active and the app is now using the backend JWT
                authentication flow.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Private features stay behind authenticated access.
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                Session state reflects the backend JWT flow.
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                The UI is ready for future private community features.
              </div>
            </div>

            <div>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-xl border-white/12 bg-white/5 px-6 text-sm font-semibold text-slate-100 hover:bg-white/10"
                onClick={onLogOut}
              >
                Log out
              </Button>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.5)]">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-cyan-100">
                  Current status
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Session verified
                </h2>
                <p className="text-sm leading-6 text-slate-300">
                  The frontend is receiving an authenticated session and can
                  render private views with strong visual separation.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Signed in as
                  </p>
                  <p className="mt-2 break-all text-sm text-slate-100">
                    {emailAddress}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  Backend JWT authentication is active.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
