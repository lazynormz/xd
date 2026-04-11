import { useEffect, useState, type ReactElement } from 'react'

import {
  clearStoredAuthSession,
  getStoredAuthSession,
  type AuthSession,
} from '@/features/auth/services/auth-session-storage'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { HomePage } from '@/features/home/pages/home-page'

const LOGIN_PATH = '/'
const REGISTER_PATH = '/register'

function getCurrentPath(): string {
  return window.location.pathname
}

function isPublicLoggedOutPath(pathname: string): boolean {
  return pathname === LOGIN_PATH || pathname === REGISTER_PATH
}

function redirectToLoginIfNeeded(isAuthenticated: boolean): void {
  const currentPath = getCurrentPath()

  if (isAuthenticated || isPublicLoggedOutPath(currentPath)) {
    return
  }

  window.history.replaceState(null, '', LOGIN_PATH)
}

export function App(): ReactElement {
  const [pathname, setPathname] = useState(() => getCurrentPath())
  const [session, setSession] = useState<AuthSession | null>(() =>
    getStoredAuthSession(),
  )
  const isAuthenticated = session !== null

  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history)
    const originalReplaceState = window.history.replaceState.bind(window.history)

    function syncPath(): void {
      redirectToLoginIfNeeded(isAuthenticated)
      setPathname(getCurrentPath())
    }

    window.history.pushState = function pushState(...args): void {
      originalPushState(...args)
      syncPath()
    }

    window.history.replaceState = function replaceState(...args): void {
      originalReplaceState(...args)
      syncPath()
    }

    syncPath()
    window.addEventListener('popstate', syncPath)

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', syncPath)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    if (pathname === REGISTER_PATH) {
      return (
        <RegisterPage
          onNavigateToLogin={() => {
            window.history.pushState(null, '', LOGIN_PATH)
          }}
          onRegistered={nextSession => {
            setSession(nextSession)
          }}
        />
      )
    }

    return (
      <LoginPage
        onNavigateToRegister={() => {
          window.history.pushState(null, '', REGISTER_PATH)
        }}
        onSignedIn={nextSession => {
          setSession(nextSession)
        }}
      />
    )
  }

  return (
    <HomePage
      emailAddress={session.user.email}
      onLogOut={() => {
        clearStoredAuthSession()
        setSession(null)
      }}
    />
  )
}
