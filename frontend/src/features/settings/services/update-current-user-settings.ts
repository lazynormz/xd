import {
  getProblemDetailsMessage,
  readJsonSafely,
  sendApiRequestAsync,
  type ProblemDetailsResponse,
} from '@/lib/api/api-client'

interface AuthenticatedUserDto {
  displayName: string
  email: string
  id: string
}

interface UpdateCurrentUserSettingsResult {
  message: string
  success: boolean
  user: AuthenticatedUserDto | null
}

export async function updateCurrentUserSettingsAsync(
  accessToken: string,
  displayName: string,
): Promise<UpdateCurrentUserSettingsResult> {
  const response = await sendApiRequestAsync('/api/auth/me', {
    accessToken,
    body: JSON.stringify({
      displayName: displayName.trim(),
    }),
    method: 'PUT',
  })

  if (!response.ok) {
    const problemDetails = await readJsonSafely<ProblemDetailsResponse>(response)

    return {
      message: getProblemDetailsMessage(
        problemDetails,
        'Unable to update your settings right now.',
      ),
      success: false,
      user: null,
    }
  }

  const user = await readJsonSafely<AuthenticatedUserDto>(response)

  if (!user) {
    return {
      message: 'The server returned an empty user response.',
      success: false,
      user: null,
    }
  }

  return {
    message: '',
    success: true,
    user,
  }
}
