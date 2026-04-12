import { useState, type FormEvent, type ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import type { CreateGameFormValues } from '@/features/games/types/create-game-form-values'

interface CreateGameFormErrors {
  description?: string
  genre?: string
  priceEur?: string
  title?: string
}

interface CreateGameFormProps {
  isSubmitting: boolean
  onSubmit: (values: CreateGameFormValues) => Promise<boolean>
  submitErrorMessage: string
}

const DEFAULT_VALUES: CreateGameFormValues = {
  description: '',
  genre: '',
  priceEur: '',
  title: '',
}

const INPUT_CLASS_NAME =
  'h-12 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/15'

const TEXTAREA_CLASS_NAME =
  'min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/15'

function validateCreateGameValues(
  values: CreateGameFormValues,
): CreateGameFormErrors {
  const errors: CreateGameFormErrors = {}
  const parsedPrice = Number(values.priceEur)

  if (!values.title.trim()) {
    errors.title = 'Enter a game title.'
  }

  if (!values.description.trim()) {
    errors.description = 'Add a short description.'
  }

  if (!values.genre.trim()) {
    errors.genre = 'Enter a genre.'
  }

  if (!values.priceEur.trim()) {
    errors.priceEur = 'Enter a price in EUR.'
  } else if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    errors.priceEur = 'Enter a valid price of 0 or higher.'
  } else if (parsedPrice > 999.99) {
    errors.priceEur = 'Keep the price below 1,000 EUR.'
  }

  return errors
}

export function CreateGameForm({
  isSubmitting,
  onSubmit,
  submitErrorMessage,
}: CreateGameFormProps): ReactElement {
  const [values, setValues] = useState<CreateGameFormValues>(DEFAULT_VALUES)
  const [errors, setErrors] = useState<CreateGameFormErrors>({})

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    const nextErrors = validateCreateGameValues(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const didCreate = await onSubmit(values)

    if (didCreate) {
      setValues(DEFAULT_VALUES)
    }
  }

  function updateField<K extends keyof CreateGameFormValues>(
    key: K,
    nextValue: CreateGameFormValues[K],
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
        <label className="block text-sm font-medium text-slate-200" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          value={values.title}
          onChange={event => {
            updateField('title', event.target.value)
          }}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={INPUT_CLASS_NAME}
          placeholder="Split Fiction"
        />
        {errors.title ? (
          <p id="title-error" className="text-sm text-red-300">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-200"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          value={values.description}
          onChange={event => {
            updateField('description', event.target.value)
          }}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
          className={TEXTAREA_CLASS_NAME}
          placeholder="Why should the group queue this up next?"
        />
        {errors.description ? (
          <p id="description-error" className="text-sm text-red-300">
            {errors.description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200" htmlFor="price-eur">
            Price (EUR)
          </label>
          <input
            id="price-eur"
            inputMode="decimal"
            value={values.priceEur}
            onChange={event => {
              updateField('priceEur', event.target.value)
            }}
            aria-invalid={Boolean(errors.priceEur)}
            aria-describedby={errors.priceEur ? 'price-eur-error' : undefined}
            className={INPUT_CLASS_NAME}
            placeholder="39.99"
          />
          {errors.priceEur ? (
            <p id="price-eur-error" className="text-sm text-red-300">
              {errors.priceEur}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200" htmlFor="genre">
            Genre
          </label>
          <input
            id="genre"
            value={values.genre}
            onChange={event => {
              updateField('genre', event.target.value)
            }}
            aria-invalid={Boolean(errors.genre)}
            aria-describedby={errors.genre ? 'genre-error' : undefined}
            className={INPUT_CLASS_NAME}
            placeholder="Co-op adventure"
          />
          {errors.genre ? (
            <p id="genre-error" className="text-sm text-red-300">
              {errors.genre}
            </p>
          ) : null}
        </div>
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

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-cyan-300 px-6 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:bg-cyan-300/60 disabled:text-slate-950/80 disabled:hover:bg-cyan-300/60"
      >
        {isSubmitting ? 'Adding game...' : 'Add game to play'}
      </Button>
    </form>
  )
}
