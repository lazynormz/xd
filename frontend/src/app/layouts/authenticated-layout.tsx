import type { ReactElement, ReactNode } from 'react'
import { Gamepad2, LayoutDashboard, LogOut, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { AuthSession } from '@/features/auth/services/auth-session-storage'

interface NavigationItem {
  href: string
  icon: typeof LayoutDashboard
  label: string
}

interface AuthenticatedLayoutProps {
  children: ReactNode
  currentPathname: string
  onLogOut: () => void
  onNavigate: (pathname: string) => void
  session: AuthSession
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/games',
    icon: Gamepad2,
    label: 'Games',
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
  },
]

export function AuthenticatedLayout({
  children,
  currentPathname,
  onLogOut,
  onNavigate,
  session,
}: AuthenticatedLayoutProps): ReactElement {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_22%),radial-gradient(circle_at_85%_15%,_rgba(251,191,36,0.12),_transparent_20%),linear-gradient(180deg,_rgba(15,23,42,0.96)_0%,_rgba(2,6,23,1)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-300/8 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_32px_120px_rgba(2,6,23,0.48)] backdrop-blur-xl">
          <div className="flex min-h-[calc(100vh-5rem)] flex-col lg:flex-row">
            <aside className="w-full shrink-0 border-b border-white/8 bg-slate-950/55 p-5 lg:w-80 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex h-full flex-col gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
                Private friend hub
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  XD dashboard
                </h1>
                <p className="text-sm leading-6 text-slate-300">
                  A shared home for games now, with room for the rest of the
                  group features later.
                </p>
              </div>
            </div>

            <nav aria-label="Primary" className="grid gap-2">
              {NAVIGATION_ITEMS.map(item => {
                const Icon = item.icon
                const isActive = currentPathname === item.href

                return (
                  <button
                    key={item.href}
                    type="button"
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? 'border-cyan-300/25 bg-cyan-300/12 text-cyan-50'
                        : 'border-white/8 bg-slate-950/45 text-slate-200 hover:bg-white/6'
                    }`}
                    onClick={() => {
                      onNavigate(item.href)
                    }}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Signed in as
              </p>
              <p className="mt-2 break-all text-sm text-slate-100">
                {session.user.displayName}
              </p>
              <p className="mt-1 break-all text-sm text-slate-400">
                {session.user.email}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 h-11 w-full rounded-xl border-white/12 bg-white/5 px-4 text-sm font-semibold text-slate-100 hover:bg-white/10"
                onClick={onLogOut}
              >
                <LogOut />
                Log out
              </Button>
            </div>
          </div>
            </aside>

            <section className="min-w-0 flex-1 bg-slate-950/28 p-5 lg:p-8">
              {children}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
