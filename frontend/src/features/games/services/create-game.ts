import {
  getProblemDetailsMessage,
  readJsonSafely,
  sendApiRequestAsync,
  type ProblemDetailsResponse,
} from '@/lib/api/api-client'
import type { CreateGameFormValues } from '@/features/games/types/create-game-form-values'
import type { Game } from '@/features/games/types/game'

interface CreateGameResult {
  game: Game | null
  message: string
  success: boolean
}

export async function createGameAsync(
  accessToken: string,
  values: CreateGameFormValues,
): Promise<CreateGameResult> {
  const response = await sendApiRequestAsync('/api/games', {
    accessToken,
    body: JSON.stringify({
      description: values.description.trim(),
      genre: values.genre.trim(),
      priceEur: Number(values.priceEur),
      title: values.title.trim(),
    }),
    method: 'POST',
  })

  if (!response.ok) {
    const problemDetails = await readJsonSafely<ProblemDetailsResponse>(response)

    return {
      game: null,
      message: getProblemDetailsMessage(
        problemDetails,
        'Unable to add this game right now.',
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
