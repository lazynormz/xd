import { useState, type FormEvent, type ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import type { AuthSession } from '@/features/auth/services/auth-session-storage'
import { registerAsync } from '@/features/auth/services/register'
import type { RegisterFormValues } from '@/features/auth/types/register-form-values'

interface RegisterFormErrors {
  email?: string
  password?: string
}

interface RegisterFormProps {
  onRegistered: (session: AuthSession) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEFAULT_VALUES: RegisterFormValues = {
  email: '',
  password: '',
}

function validateRegisterValues(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {}

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
      const result = await registerAsync(values)

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
          className="block text-sm font-medium text-stone-900"
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
          className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p id="register-email-error" className="text-sm text-red-700">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-stone-900"
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
          className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
          placeholder="Create a password"
        />
        {errors.password ? (
          <p id="register-password-error" className="text-sm text-red-700">
            {errors.password}
          </p>
        ) : (
          <p id="register-password-hint" className="text-sm text-stone-500">
            Use at least 8 characters.
          </p>
        )}
      </div>

      {submitError ? (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {submitError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-stone-950 px-6 text-sm font-semibold text-white hover:bg-stone-800 disabled:hover:bg-stone-950"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
