import { useState, type FormEvent, type ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import type { AuthSession } from '@/features/auth/services/auth-session-storage'
import { registerAsync } from '@/features/auth/services/register'
import type { RegisterFormValues } from '@/features/auth/types/register-form-values'

interface RegisterFormErrors {
  email?: string
  password?: string
  username?: string
}

interface RegisterFormProps {
  onRegistered: (session: AuthSession) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEFAULT_VALUES: RegisterFormValues = {
  email: '',
  password: '',
  username: '',
}

const USERNAME_ERROR_MESSAGE =
  'Use 1 to 64 characters with letters, numbers, hyphens, or underscores.'

const INPUT_CLASS_NAME =
  'h-12 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-slate-500 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/15'

function validateRegisterValues(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {}
  const normalizedUsername = values.username.trim()

  if (!normalizedUsername) {
    errors.username = 'Enter a username.'
  } else if (normalizedUsername.length > 64) {
    errors.username = USERNAME_ERROR_MESSAGE
  } else if (!/^[a-zA-Z0-9_-]+$/.test(normalizedUsername)) {
    errors.username = USERNAME_ERROR_MESSAGE
  }

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Enter a password.'
  } else if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  }

  return errors
}

export function RegisterForm({
  onRegistered,
}: RegisterFormProps): ReactElement {
  const [values, setValues] = useState<RegisterFormValues>(DEFAULT_VALUES)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const nextErrors = validateRegisterValues(values)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await registerAsync({
        ...values,
        username: values.username.trim(),
      })

      if (!result.success) {
        setSubmitError(result.message)
        return
      }

      setValues(DEFAULT_VALUES)
      onRegistered(result.session)
    } catch {
      setSubmitError('Something went wrong while creating your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function updateField<K extends keyof RegisterFormValues>(
    key: K,
    nextValue: RegisterFormValues[K],
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
          htmlFor="register-username"
        >
          Username
        </label>
        <input
          id="register-username"
          autoComplete="nickname"
          value={values.username}
          onChange={event => {
            updateField('username', event.target.value)
          }}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={
            errors.username ? 'register-username-error' : 'register-username-hint'
          }
          className={INPUT_CLASS_NAME}
          placeholder="captain_coop"
        />
        {errors.username ? (
          <p id="register-username-error" className="text-sm text-red-300">
            {errors.username}
          </p>
        ) : (
          <p id="register-username-hint" className="text-sm text-slate-400">
            {USERNAME_ERROR_MESSAGE}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-200"
          htmlFor="register-email"
        >
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={event => {
            updateField('email', event.target.value)
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          className={INPUT_CLASS_NAME}
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p id="register-email-error" className="text-sm text-red-300">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-200"
          htmlFor="register-password"
        >
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={event => {
            updateField('password', event.target.value)
          }}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? 'register-password-error' : 'register-password-hint'
          }
          className={INPUT_CLASS_NAME}
          placeholder="Create a password"
        />
        {errors.password ? (
          <p id="register-password-error" className="text-sm text-red-300">
            {errors.password}
          </p>
        ) : (
          <p id="register-password-hint" className="text-sm text-slate-400">
            Use at least 8 characters.
          </p>
        )}
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
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
