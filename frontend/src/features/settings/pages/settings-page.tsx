import { useState, type ReactElement } from 'react'

import type { AuthSession } from '@/features/auth/services/auth-session-storage'
import { SettingsForm } from '@/features/settings/components/settings-form'
import { updateCurrentUserSettingsAsync } from '@/features/settings/services/update-current-user-settings'
import type { UpdateSettingsFormValues } from '@/features/settings/types/update-settings-form-values'

interface SettingsPageProps {
  accessToken: string
  onSessionChanged: (session: AuthSession) => void
  session: AuthSession
}

export function SettingsPage({
  accessToken,
  onSessionChanged,
  session,
}: SettingsPageProps): ReactElement {
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(
    values: UpdateSettingsFormValues,
  ): Promise<void> {
    setSubmitErrorMessage('')
    setSubmitSuccessMessage('')
    setIsSubmitting(true)

    try {
      const result = await updateCurrentUserSettingsAsync(
        accessToken,
        values.displayName,
      )

      if (!result.success || !result.user) {
        setSubmitErrorMessage(result.message)
        return
      }

      onSessionChanged({
        ...session,
        user: {
          ...session.user,
          displayName: result.user.displayName,
          email: result.user.email,
          id: result.user.id,
        },
      })

      setSubmitSuccessMessage('Your settings were saved.')
    } catch {
      setSubmitErrorMessage('Something went wrong while saving your settings.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
          Settings
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your profile
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Update the username the rest of the group sees across the app.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.9fr)]">
        <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/50 p-5 sm:p-6">
          <SettingsForm
            currentDisplayName={session.user.displayName}
            emailAddress={session.user.email}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitErrorMessage={submitErrorMessage}
            submitSuccessMessage={submitSuccessMessage}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm font-medium text-amber-100">Live now</p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Username updates
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Changes save to your account immediately and update this session
              as soon as the server accepts them.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm font-medium text-emerald-100">Later</p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              More personal settings
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This page is ready to grow once avatar, notifications, or other
              account preferences are added.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
