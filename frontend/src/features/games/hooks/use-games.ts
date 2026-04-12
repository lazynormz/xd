import { startTransition, useEffect, useState } from 'react'

import { createGameAsync } from '@/features/games/services/create-game'
import { getGamesAsync } from '@/features/games/services/get-games'
import { joinGameAsync } from '@/features/games/services/join-game'
import type { CreateGameFormValues } from '@/features/games/types/create-game-form-values'
import type { Game } from '@/features/games/types/game'

interface JoinGameError {
  gameId: string
  message: string
}

export interface UseGamesResult {
  createErrorMessage: string
  createGameAsync: (values: CreateGameFormValues) => Promise<Game | null>
  games: Game[]
  isCreating: boolean
  isJoiningGameId: string | null
  isLoading: boolean
  isRefreshing: boolean
  joinError: JoinGameError | null
  joinSelectedGameAsync: (gameId: string) => Promise<Game | null>
  loadErrorMessage: string
  reloadGamesAsync: () => Promise<void>
}

export function useGames(accessToken: string): UseGamesResult {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoiningGameId, setIsJoiningGameId] = useState<string | null>(null)
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [createErrorMessage, setCreateErrorMessage] = useState('')
  const [joinError, setJoinError] = useState<JoinGameError | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadInitialGamesAsync(): Promise<void> {
      setIsLoading(true)
      setLoadErrorMessage('')

      try {
        const result = await getGamesAsync(accessToken)

        if (!isActive) {
          return
        }

        if (!result.success) {
          setLoadErrorMessage(result.message)
          return
        }

        startTransition(() => {
          setGames(result.games)
        })
      } catch {
        if (!isActive) {
          return
        }

        setLoadErrorMessage('Something went wrong while loading the games list.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadInitialGamesAsync()

    return () => {
      isActive = false
    }
  }, [accessToken])

  async function reloadGamesAsync(): Promise<void> {
    setIsRefreshing(true)
    setLoadErrorMessage('')
    setJoinError(null)

    try {
      const result = await getGamesAsync(accessToken)

      if (!result.success) {
        setLoadErrorMessage(result.message)
        return
      }

      startTransition(() => {
        setGames(result.games)
      })
    } catch {
      setLoadErrorMessage('Something went wrong while loading the games list.')
    } finally {
      setIsRefreshing(false)
    }
  }

  async function createNextGameAsync(
    values: CreateGameFormValues,
  ): Promise<Game | null> {
    setIsCreating(true)
    setCreateErrorMessage('')
    setLoadErrorMessage('')
    setJoinError(null)

    try {
      const result = await createGameAsync(accessToken, values)

      if (!result.success || !result.game) {
        setCreateErrorMessage(result.message)
        return null
      }

      startTransition(() => {
        setGames(currentGames => [result.game!, ...currentGames])
      })

      return result.game
    } catch {
      setCreateErrorMessage('Something went wrong while adding this game.')
      return null
    } finally {
      setIsCreating(false)
    }
  }

  async function joinSelectedGameAsync(gameId: string): Promise<Game | null> {
    setIsJoiningGameId(gameId)
    setJoinError(null)
    setLoadErrorMessage('')

    try {
      const result = await joinGameAsync(accessToken, gameId)

      if (!result.success || !result.game) {
        setJoinError({
          gameId,
          message: result.message,
        })
        return null
      }

      startTransition(() => {
        setGames(currentGames =>
          currentGames.map(game =>
            game.id === result.game!.id ? result.game! : game,
          ),
        )
      })

      return result.game
    } catch {
      setJoinError({
        gameId,
        message: 'Something went wrong while joining this game.',
      })
      return null
    } finally {
      setIsJoiningGameId(null)
    }
  }

  return {
    createErrorMessage,
    createGameAsync: createNextGameAsync,
    games,
    isCreating,
    isJoiningGameId,
    isLoading,
    isRefreshing,
    joinError,
    joinSelectedGameAsync,
    loadErrorMessage,
    reloadGamesAsync,
  }
}
