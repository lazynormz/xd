import {
  storeAuthSession,
  type AuthSession,
} from '@/features/auth/services/auth-session-storage'
import type { RegisterFormValues } from '@/features/auth/types/register-form-values'
import {
  getProblemDetailsMessage,
  readJsonSafely,
  sendApiRequestAsync,
  type ProblemDetailsResponse,
} from '@/lib/api/api-client'

interface AuthenticationResponseDto {
  accessToken: string
  expiresAtUtc: string
  user: {
    displayName: string
    email: string
    id: string
  }
}

export interface RegisterResult {
  message: string
  session: AuthSession
  success: boolean
}

export async function registerAsync(
  values: RegisterFormValues,
): Promise<RegisterResult> {
  const response = await sendApiRequestAsync('/api/auth/register', {
    body: JSON.stringify(values),
    method: 'POST',
  })

  if (!response.ok) {
    const problemDetails = await readJsonSafely<ProblemDetailsResponse>(response)

    return {
      message: getProblemDetailsMessage(problemDetails, 'Unable to register.'),
      session: createEmptySession(),
      success: false,
    }
  }

  const payload = await readJsonSafely<AuthenticationResponseDto>(response)

  if (!payload) {
    return {
      message: 'The registration response was empty.',
      session: createEmptySession(),
      success: false,
    }
  }

  const session: AuthSession = {
    accessToken: payload.accessToken,
    expiresAtUtc: payload.expiresAtUtc,
    user: {
      displayName: payload.user.displayName,
      email: payload.user.email,
      id: payload.user.id,
    },
  }

  storeAuthSession(session)

  return {
    message: '',
    session,
    success: true,
  }
}

function createEmptySession(): AuthSession {
  return {
    accessToken: '',
    expiresAtUtc: '',
    user: {
      displayName: '',
      email: '',
      id: '',
    },
  }
}
