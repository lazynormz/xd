import { useEffect, type ReactElement, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CreateGameModalProps {
  children: ReactNode
  description: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export function CreateGameModal({
  children,
  description,
  isOpen,
  onClose,
  title,
}: CreateGameModalProps): ReactElement | null {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/78 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-game-modal-title"
      aria-describedby="create-game-modal-description"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-6 shadow-[0_36px_120px_rgba(2,6,23,0.6)] sm:p-7"
        onClick={event => {
          event.stopPropagation()
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_60%)]"
        />

        <div className="relative space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
                New entry
              </div>
              <div className="space-y-1">
                <h2
                  id="create-game-modal-title"
                  className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                  {title}
                </h2>
                <p
                  id="create-game-modal-description"
                  className="max-w-xl text-sm leading-6 text-slate-300"
                >
                  {description}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-11 rounded-2xl border-white/12 bg-white/5 p-0 text-slate-100 hover:bg-white/10"
              onClick={onClose}
            >
              <X className="size-5" />
              <span className="sr-only">Close add game dialog</span>
            </Button>
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/78 p-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
