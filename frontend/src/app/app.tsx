import { useEffect, useState, type ReactElement } from 'react'

import {
  clearStoredAuthSession,
  getStoredAuthSession,
  storeAuthSession,
  type AuthSession,
} from '@/features/auth/services/auth-session-storage'
import { AuthenticatedLayout } from '@/app/layouts/authenticated-layout'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { HomePage } from '@/features/home/pages/home-page'
import { GamesPage } from '@/features/games/pages/games-page'
import { SettingsPage } from '@/features/settings/pages/settings-page'

const LOGIN_PATH = '/'
const REGISTER_PATH = '/register'
const DASHBOARD_PATH = '/dashboard'
const GAMES_PATH = '/games'
const SETTINGS_PATH = '/settings'

function getCurrentPath(): string {
  return window.location.pathname
}

function isPublicLoggedOutPath(pathname: string): boolean {
  return pathname === LOGIN_PATH || pathname === REGISTER_PATH
}

function isAuthenticatedPath(pathname: string): boolean {
  return (
    pathname === DASHBOARD_PATH ||
    pathname === GAMES_PATH ||
    pathname === SETTINGS_PATH
  )
}

function normalizePublicPath(pathname: string): string {
  return isPublicLoggedOutPath(pathname) ? pathname : LOGIN_PATH
}

function normalizeAuthenticatedPath(pathname: string): string {
  return isAuthenticatedPath(pathname) ? pathname : DASHBOARD_PATH
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
      const currentPath = getCurrentPath()
      const nextPath = isAuthenticated
        ? normalizeAuthenticatedPath(currentPath)
        : normalizePublicPath(currentPath)

      if (nextPath !== currentPath) {
        originalReplaceState(null, '', nextPath)
      }

      setPathname(nextPath)
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
    const publicPathname = normalizePublicPath(pathname)

    if (publicPathname === REGISTER_PATH) {
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

  const authenticatedPathname = normalizeAuthenticatedPath(pathname)

  function handleSessionChanged(nextSession: AuthSession): void {
    storeAuthSession(nextSession)
    setSession(nextSession)
  }

  return (
    <AuthenticatedLayout
      currentPathname={authenticatedPathname}
      session={session}
      onNavigate={nextPathname => {
        window.history.pushState(null, '', nextPathname)
      }}
      onLogOut={() => {
        clearStoredAuthSession()
        setSession(null)
      }}
    >
      {authenticatedPathname === GAMES_PATH ? (
        <GamesPage
          accessToken={session.accessToken}
          currentUserId={session.user.id}
        />
      ) : authenticatedPathname === SETTINGS_PATH ? (
        <SettingsPage
          accessToken={session.accessToken}
          session={session}
          onSessionChanged={handleSessionChanged}
        />
      ) : (
        <HomePage
          displayName={session.user.displayName}
          emailAddress={session.user.email}
        />
      )}
    </AuthenticatedLayout>
  )
}
