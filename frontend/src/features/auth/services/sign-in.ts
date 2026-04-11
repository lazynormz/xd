import type { LoginFormValues } from '@/features/auth/types/login-form-values'

export interface SignInResult {
  message: string
  success: boolean
}

export async function signInAsync(
  credentials: LoginFormValues,
): Promise<SignInResult> {
  await new Promise(resolve => window.setTimeout(resolve, 500))

  return {
    message: `Login is not connected yet for ${credentials.email}. Wire this form to the backend auth endpoint next.`,
    success: false,
  }
}
