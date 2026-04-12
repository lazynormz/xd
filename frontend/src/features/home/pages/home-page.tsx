import type { ReactElement } from 'react'

interface HomePageProps {
  displayName: string
  emailAddress: string
}

export function HomePage({
  displayName,
  emailAddress,
}: HomePageProps): ReactElement {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
          Dashboard
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome, {displayName}.
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Signed in as {emailAddress}. This is the shared landing area after
          login. We can grow this into a real overview later with activity,
          shortcuts, and whatever features we add next.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
          <p className="text-sm font-medium text-cyan-100">Now live</p>
          <h3 className="mt-3 text-xl font-semibold text-white">Games</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The first feature is available from the navigation, including the
            shared interest list and add-game flow.
          </p>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
          <p className="text-sm font-medium text-amber-100">Planned space</p>
          <h3 className="mt-3 text-xl font-semibold text-white">
            Future modules
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Movies, ratings, clips, and more can slot into the same navigation
            without changing the whole app shell again.
          </p>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
          <p className="text-sm font-medium text-emerald-100">Status</p>
          <h3 className="mt-3 text-xl font-semibold text-white">
            Session verified
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The frontend is using the authenticated JWT session and ready for
            more private features.
          </p>
        </div>
      </div>
    </div>
  )
}
