import { useState, type ReactElement } from 'react'

import { Gamepad2, Plus, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CreateGameForm } from '@/features/games/components/create-game-form'
import { CreateGameModal } from '@/features/games/components/create-game-modal'
import { GameCard } from '@/features/games/components/game-card'
import { useGames } from '@/features/games/hooks/use-games'
import type { CreateGameFormValues } from '@/features/games/types/create-game-form-values'

interface GamesPageProps {
  accessToken: string
  currentUserId: string
}

export function GamesPage({
  accessToken,
  currentUserId,
}: GamesPageProps): ReactElement {
  const {
    createErrorMessage,
    createGameAsync,
    games,
    isCreating,
    isJoiningGameId,
    isLoading,
    isRefreshing,
    joinError,
    joinSelectedGameAsync,
    loadErrorMessage,
    reloadGamesAsync,
  } = useGames(accessToken)
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const visibleExpandedGameId =
    expandedGameId && games.some(game => game.id === expandedGameId)
      ? expandedGameId
      : null

  async function handleCreateGameAsync(
    values: CreateGameFormValues,
  ): Promise<boolean> {
    const createdGame = await createGameAsync(values)

    if (!createdGame) {
      return false
    }

    setExpandedGameId(createdGame.id)
    setIsCreateModalOpen(false)

    return true
  }

  async function handleJoinGameAsync(gameId: string): Promise<void> {
    const updatedGame = await joinSelectedGameAsync(gameId)

    if (!updatedGame) {
      return
    }

    setExpandedGameId(updatedGame.id)
  }

  return (
    <>
      <div className="rounded-[2rem] border border-white/8 bg-slate-950/26 p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
              Games to play
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What should we play next?
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Build the next group backlog, see who is in, and add new ideas
              without losing space for the shared list.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-white/12 bg-white/5 px-4 text-sm font-semibold text-slate-100 hover:bg-white/10"
              onClick={() => {
                void reloadGamesAsync()
              }}
            >
              <RefreshCw className={isRefreshing ? 'animate-spin' : ''} />
              Refresh list
            </Button>

            <Button
              type="button"
              className="h-11 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              onClick={() => {
                setIsCreateModalOpen(true)
              }}
            >
              <Plus className="size-4" />
              Add game
            </Button>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-3 text-cyan-100">
                <Gamepad2 className="size-5" />
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Total games
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-100">
                  {games.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loadErrorMessage ? (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{loadErrorMessage}</span>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl border-red-300/25 bg-red-500/10 px-4 text-sm font-semibold text-red-50 hover:bg-red-500/20"
                onClick={() => {
                  void reloadGamesAsync()
                }}
              >
                Try again
              </Button>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-[1.6rem] border border-white/10 bg-slate-950/55"
              />
            ))}
          </div>
        ) : games.length === 0 && !loadErrorMessage ? (
          <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-slate-950/50 px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-white">No games yet</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Add the first game to kick off the shared queue.
            </p>
            <Button
              type="button"
              className="mt-5 h-11 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              onClick={() => {
                setIsCreateModalOpen(true)
              }}
            >
              <Plus className="size-4" />
              Add game
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {games.map(game => (
              <GameCard
                key={game.id}
                currentUserId={currentUserId}
                game={game}
                isExpanded={visibleExpandedGameId === game.id}
                isJoining={isJoiningGameId === game.id}
                joinErrorMessage={
                  joinError?.gameId === game.id ? joinError.message : ''
                }
                onJoin={handleJoinGameAsync}
                onToggle={gameId => {
                  setExpandedGameId(currentGameId =>
                    currentGameId === gameId ? null : gameId,
                  )
                }}
              />
            ))}
          </div>
        )}
      </div>

      <CreateGameModal
        description="Capture the basics now, then let the group signal interest."
        isOpen={isCreateModalOpen}
        title="Add a game"
        onClose={() => {
          if (isCreating) {
            return
          }

          setIsCreateModalOpen(false)
        }}
      >
        <CreateGameForm
          isSubmitting={isCreating}
          submitErrorMessage={createErrorMessage}
          onSubmit={handleCreateGameAsync}
        />
      </CreateGameModal>
    </>
  )
}
