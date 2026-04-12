import {
  getProblemDetailsMessage,
  readJsonSafely,
  sendApiRequestAsync,
  type ProblemDetailsResponse,
} from '@/lib/api/api-client'
import type { Game } from '@/features/games/types/game'

interface JoinGameResult {
  game: Game | null
  message: string
  success: boolean
}

export async function joinGameAsync(
  accessToken: string,
  gameId: string,
): Promise<JoinGameResult> {
  const response = await sendApiRequestAsync(`/api/games/${gameId}/interest`, {
    accessToken,
    method: 'POST',
  })

  if (!response.ok) {
    const problemDetails = await readJsonSafely<ProblemDetailsResponse>(response)

    return {
      game: null,
      message: getProblemDetailsMessage(
        problemDetails,
        'Unable to join this game right now.',
      ),
      success: false,
    }
  }

  const game = await readJsonSafely<Game>(response)

  if (!game) {
    return {
      game: null,
      message: 'The server returned an empty game response.',
      success: false,
    }
  }

  return {
    game,
    message: '',
    success: true,
  }
}
