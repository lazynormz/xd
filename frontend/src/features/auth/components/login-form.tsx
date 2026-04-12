import { useState, type FormEvent, type ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import type { AuthSession } from '@/features/auth/services/auth-session-storage'
import { signInAsync } from '@/features/auth/services/sign-in'
import type { LoginFormValues } from '@/features/auth/types/login-form-values'

interface LoginFormErrors {
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEFAULT_VALUES: LoginFormValues = {
  email: '',
  password: '',
}

interface LoginFormProps {
  onSignedIn: (session: AuthSession) => void
}

const INPUT_CLASS_NAME =
  'h-12 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-slate-500 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/15'

function validateLoginValues(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Enter your password.'
  }

  return errors
}

export function LoginForm({ onSignedIn }: LoginFormProps): ReactElement {
  const [values, setValues] = useState<LoginFormValues>(DEFAULT_VALUES)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const nextErrors = validateLoginValues(values)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signInAsync(values)

      if (!result.success) {
        setSubmitError(result.message)
        return
      }

      setValues(DEFAULT_VALUES)
      onSignedIn(result.session)
    } catch {
      setSubmitError('Something went wrong while trying to sign you in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function updateField<K extends keyof LoginFormValues>(
    key: K,
    nextValue: LoginFormValues[K],
  ): void {
    setValues(currentValues => ({
      ...currentValues,
      [key]: nextValue,
    }))

    setErrors(currentErrors => ({
      ...currentErrors,
      [key]: undefined,
    }))
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={event => {
        void handleSubmit(event)
      }}
    >
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-200"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={values.email}
          onChange={event => {
            updateField('email', event.target.value)
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={INPUT_CLASS_NAME}
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-red-300">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-200"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={event => {
            updateField('password', event.target.value)
          }}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={INPUT_CLASS_NAME}
          placeholder="Enter your password"
        />
        {errors.password ? (
          <p id="password-error" className="text-sm text-red-300">
            {errors.password}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          {submitError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-amber-300 px-6 text-sm font-semibold text-slate-950 hover:bg-amber-200 disabled:bg-amber-300/60 disabled:text-slate-950/80 disabled:hover:bg-amber-300/60"
      >
        {isSubmitting ? 'Signing in...' : 'Log in'}
      </Button>
    </form>
  )
}
