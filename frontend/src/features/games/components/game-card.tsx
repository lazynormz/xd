import type { ReactElement } from 'react'
import { ChevronDown, Sparkles, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Game } from '@/features/games/types/game'

interface GameCardProps {
  currentUserId: string
  game: Game
  isExpanded: boolean
  isJoining: boolean
  joinErrorMessage: string
  onJoin: (gameId: string) => Promise<void>
  onToggle: (gameId: string) => void
}

function formatPrice(priceEur: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceEur)
}

export function GameCard({
  currentUserId,
  game,
  isExpanded,
  isJoining,
  joinErrorMessage,
  onJoin,
  onToggle,
}: GameCardProps): ReactElement {
  const signedUpUsers = game.interestedUsers
  const panelId = `game-panel-${game.id}`

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/65 shadow-[0_24px_60px_rgba(2,6,23,0.28)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/4 sm:px-6"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => {
          onToggle(game.id)
        }}
      >
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-cyan-100">
              {game.genre}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              {formatPrice(game.priceEur)}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {game.title}
            </h3>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              {game.description}
            </p>
            {signedUpUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {signedUpUsers.map(interestedUser => {
                  const isCurrentUser = interestedUser.id === currentUserId

                  return (
                    <span
                      key={interestedUser.id}
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                        isCurrentUser
                          ? 'border-emerald-300/20 bg-emerald-300/12 text-emerald-50'
                          : 'border-white/10 bg-white/5 text-slate-200'
                      }`}
                    >
                      {interestedUser.displayName}
                      {isCurrentUser ? ' (you)' : ''}
                    </span>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right sm:block">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Wants to play
            </p>
            <p className="mt-1 text-base font-semibold text-slate-100">
              {game.interestedUsers.length}
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200">
            <ChevronDown
              className={`size-5 transition ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      {isExpanded ? (
        <div
          id={panelId}
          className="border-t border-white/8 bg-[linear-gradient(180deg,rgba(15,23,42,0.84),rgba(2,6,23,0.94))] px-5 py-5 sm:px-6"
        >
          <div className="grid gap-5">
            <div className="min-w-0 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-100">
                <Users className="size-4" />
                Who wants to play?
              </div>

              {signedUpUsers.length > 0 ? (
                <div className="grid gap-3">
                  {signedUpUsers.map(interestedUser => {
                    const isCurrentUser = interestedUser.id === currentUserId

                    return (
                      <div
                        key={interestedUser.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {interestedUser.displayName}
                            </p>
                            <p className="truncate text-slate-400">
                              {interestedUser.email}
                            </p>
                          </div>
                          {isCurrentUser ? (
                            <span className="inline-flex w-fit rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-xs font-medium text-emerald-50">
                              You
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/4 px-4 py-4 text-sm text-slate-300">
                  No one has joined this one yet. Be the first to start the hype.
                </div>
              )}
            </div>

            <aside className="min-w-0 rounded-[1.4rem] border border-emerald-300/14 bg-emerald-400/8 p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
                  <Sparkles className="size-4" />
                  Your status
                </div>

                <p className="text-sm leading-6 text-slate-200">
                  {game.currentUserWantsToPlay
                    ? 'You are already on the list for this game.'
                    : 'Join the list so everyone can see you are interested.'}
                </p>

                {joinErrorMessage ? (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                  >
                    {joinErrorMessage}
                  </p>
                ) : null}

                <Button
                  type="button"
                  size="lg"
                  disabled={game.currentUserWantsToPlay || isJoining}
                  className="h-11 w-full rounded-xl bg-emerald-300 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-200 disabled:bg-emerald-300/55 disabled:text-slate-950/75"
                  onClick={() => {
                    void onJoin(game.id)
                  }}
                >
                  {game.currentUserWantsToPlay
                    ? 'Already joined'
                    : isJoining
                      ? 'Joining...'
                      : 'I want to play this'}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </article>
  )
}
