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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18),_transparent_28%),linear-gradient(180deg,_#f4fbf8_0%,_#e7f2ec_55%,_#d7e6dd_100%)] text-stone-950">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,_rgba(15,118,110,0.14),_transparent_58%)]"
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="w-full rounded-[2rem] border border-stone-900/10 bg-white/75 p-8 shadow-[0_30px_80px_rgba(15,118,110,0.12)] backdrop-blur md:p-12">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="inline-flex w-fit items-center rounded-full border border-teal-950/10 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-900">
              Authenticated dashboard
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                Welcome, {emailAddress}.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                Your session is active and the app is now using the backend JWT
                authentication flow.
              </p>
            </div>

            <div>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-xl border-stone-300 bg-white px-6 text-sm font-semibold text-stone-950 hover:bg-stone-100"
                onClick={onLogOut}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
