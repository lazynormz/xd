import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'

export function HomePage(): ReactElement {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-6 py-16">
        <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-300">
          React + Vite + Tailwind + shadcn/ui
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Frontend foundation ready for the private platform.
          </h1>

          <p className="text-base leading-7 text-slate-300 sm:text-lg">
            The app is scaffolded with Vite, wired for Tailwind CSS, and prepared
            for shared shadcn/ui components under <code>src/components/ui</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button>Start building</Button>
          <Button variant="outline">Add components</Button>
        </div>
      </section>
    </main>
  )
}
