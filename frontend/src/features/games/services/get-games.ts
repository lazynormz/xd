import {
  getProblemDetailsMessage,
  readJsonSafely,
  sendApiRequestAsync,
  type ProblemDetailsResponse,
} from '@/lib/api/api-client'
import type { Game } from '@/features/games/types/game'

interface GetGamesResult {
  games: Game[]
  message: string
  success: boolean
}

export async function getGamesAsync(
  accessToken: string,
): Promise<GetGamesResult> {
  const response = await sendApiRequestAsync('/api/games', {
    accessToken,
  })

  if (!response.ok) {
    const problemDetails = await readJsonSafely<ProblemDetailsResponse>(response)

    return {
      games: [],
      message: getProblemDetailsMessage(
        problemDetails,
        'Unable to load games right now.',
      ),
      success: false,
    }
  }

  const games = await readJsonSafely<Game[]>(response)

  return {
    games: games ?? [],
    message: '',
    success: true,
  }
}
