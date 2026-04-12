import {
  storeAuthSession,
  type AuthSession,
} from '@/features/auth/services/auth-session-storage'
import type { LoginFormValues } from '@/features/auth/types/login-form-values'

interface AuthenticationResponseDto {
  accessToken: string
  expiresAtUtc: string
  user: {
    displayName: string
    email: string
    id: string
  }
}

interface ProblemDetailsResponse {
  detail?: string
  title?: string
}

export interface SignInResult {
  message: string
  session: AuthSession
  success: boolean
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5202'

export async function signInAsync(
  credentials: LoginFormValues,
): Promise<SignInResult> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    const problemDetails = await readJsonSafely<ProblemDetailsResponse>(response)

    return {
      message:
        problemDetails?.detail ||
        problemDetails?.title ||
        'Unable to sign in.',
      session: createEmptySession(),
      success: false,
    }
  }

  const payload = await readJsonSafely<AuthenticationResponseDto>(response)

  if (!payload) {
    return {
      message: 'The authentication response was empty.',
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

async function readJsonSafely<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
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
