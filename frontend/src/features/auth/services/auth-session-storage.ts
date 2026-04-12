export interface AuthSession {
  accessToken: string
  expiresAtUtc: string
  user: {
    displayName: string
    email: string
    id: string
  }
}

const AUTH_SESSION_STORAGE_KEY = 'xd.auth.session'

export function clearStoredAuthSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export function getStoredAuthSession(): AuthSession | null {
  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as AuthSession
    const expiresAt = Date.parse(parsedValue.expiresAtUtc)
    const hasValidUser =
      typeof parsedValue.user?.displayName === 'string' &&
      typeof parsedValue.user?.email === 'string' &&
      typeof parsedValue.user?.id === 'string'

    if (
      !Number.isFinite(expiresAt) ||
      expiresAt <= Date.now() ||
      typeof parsedValue.accessToken !== 'string' ||
      !hasValidUser
    ) {
      clearStoredAuthSession()
      return null
    }

    return parsedValue
  } catch {
    clearStoredAuthSession()
    return null
  }
}

export function storeAuthSession(session: AuthSession): void {
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}
