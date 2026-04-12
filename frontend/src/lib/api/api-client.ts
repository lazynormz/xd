interface ApiClientOptions {
  accessToken?: string
  body?: string
  method?: 'GET' | 'POST' | 'PUT'
}

export interface ProblemDetailsResponse {
  detail?: string
  title?: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5202'

export async function sendApiRequestAsync(
  path: string,
  options: ApiClientOptions = {},
): Promise<Response> {
  const headers = new Headers()

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }

  return fetch(`${API_BASE_URL}${path}`, {
    body: options.body,
    headers,
    method: options.method ?? 'GET',
  })
}

export async function readJsonSafely<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

export function getProblemDetailsMessage(
  problemDetails: ProblemDetailsResponse | null,
  fallbackMessage: string,
): string {
  return problemDetails?.detail || problemDetails?.title || fallbackMessage
}
