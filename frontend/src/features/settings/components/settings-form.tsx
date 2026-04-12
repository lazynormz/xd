import { useState, type FormEvent, type ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import type { UpdateSettingsFormValues } from '@/features/settings/types/update-settings-form-values'

interface SettingsFormErrors {
  displayName?: string
}

interface SettingsFormProps {
  currentDisplayName: string
  emailAddress: string
  isSubmitting: boolean
  onSubmit: (values: UpdateSettingsFormValues) => Promise<void>
  submitErrorMessage: string
  submitSuccessMessage: string
}

const DEFAULT_ERROR_MESSAGE =
  'Use 1 to 64 characters with letters, numbers, hyphens, or underscores.'

const INPUT_CLASS_NAME =
  'h-12 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/15'

function validateSettingsValues(
  values: UpdateSettingsFormValues,
): SettingsFormErrors {
  const errors: SettingsFormErrors = {}
  const normalizedDisplayName = values.displayName.trim()

  if (!normalizedDisplayName) {
    errors.displayName = 'Enter a display name.'
  } else if (normalizedDisplayName.length > 64) {
    errors.displayName = DEFAULT_ERROR_MESSAGE
  } else if (!/^[a-zA-Z0-9_-]+$/.test(normalizedDisplayName)) {
    errors.displayName = DEFAULT_ERROR_MESSAGE
  }

  return errors
}

export function SettingsForm({
  currentDisplayName,
  emailAddress,
  isSubmitting,
  onSubmit,
  submitErrorMessage,
  submitSuccessMessage,
}: SettingsFormProps): ReactElement {
  const [values, setValues] = useState<UpdateSettingsFormValues>({
    displayName: currentDisplayName,
  })
  const [errors, setErrors] = useState<SettingsFormErrors>({})

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const nextErrors = validateSettingsValues(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    await onSubmit({
      displayName: values.displayName.trim(),
    })
  }

  function handleDisplayNameChanged(nextDisplayName: string): void {
    setValues({
      displayName: nextDisplayName,
    })

    setErrors(currentErrors => ({
      ...currentErrors,
      displayName: undefined,
    }))
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={event => {
        void handleSubmit(event)
      }}
    >
      <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
        <p className="text-sm font-medium text-cyan-100">Account</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Your email address is fixed for now.
        </p>
        <p className="mt-3 text-sm text-slate-100">{emailAddress}</p>
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-200"
          htmlFor="display-name"
        >
          Username
        </label>
        <input
          id="display-name"
          autoComplete="nickname"
          value={values.displayName}
          onChange={event => {
            handleDisplayNameChanged(event.target.value)
          }}
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={
            errors.displayName ? 'display-name-error' : 'display-name-hint'
          }
          className={INPUT_CLASS_NAME}
          placeholder="captain_coop"
        />
        {errors.displayName ? (
          <p id="display-name-error" className="text-sm text-red-300">
            {errors.displayName}
          </p>
        ) : (
          <p id="display-name-hint" className="text-sm text-slate-400">
            {DEFAULT_ERROR_MESSAGE}
          </p>
        )}
      </div>

      {submitErrorMessage ? (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          {submitErrorMessage}
        </p>
      ) : null}

      {submitSuccessMessage ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        >
          {submitSuccessMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-cyan-300 px-6 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:bg-cyan-300/60 disabled:text-slate-950/80 disabled:hover:bg-cyan-300/60"
      >
        {isSubmitting ? 'Saving settings...' : 'Save settings'}
      </Button>
    </form>
  )
}
