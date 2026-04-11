import { useEffect, type ReactElement } from 'react'

import { LoginPage } from '@/features/auth/pages/login-page'

const LOGIN_PATH = '/'

function getCurrentPath(): string {
  return window.location.pathname
}

function redirectToLoginIfNeeded(isAuthenticated: boolean): void {
  const currentPath = getCurrentPath()

  if (isAuthenticated || currentPath === LOGIN_PATH) {
    return
  }

  window.history.replaceState(null, '', LOGIN_PATH)
}

export function App(): ReactElement {
  const isAuthenticated = false

  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history)
    const originalReplaceState = window.history.replaceState.bind(window.history)

    function syncPath(): void {
      redirectToLoginIfNeeded(isAuthenticated)
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

  return <LoginPage />
}
