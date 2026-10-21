import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { HOWTO_VIDEO_URL, youtubeEmbed } from '../config'

const STEPS = [
  'Create a room and share the code, or join a friend’s.',
  'Both tap Ready. The host picks a genre.',
  'Swipe 20 songs privately: right to like, left to pass.',
  'Take turns: describe how a liked song feels without naming it.',
  'Your friend has 30s to pick it from three. Faster = more points.',
]

export function HowToPlay() {
  const [open, setOpen] = useState(false)
  const embed = youtubeEmbed(HOWTO_VIDEO_URL)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mx-auto flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-silver transition hover:border-jam"
      >
        <span className="grid size-5 place-items-center rounded-full bg-jam text-xs font-bold text-ink">?</span>
        How to play
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="How to play"
              className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-line bg-panel p-5 text-left"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">How to play</h2>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="grid size-9 place-items-center rounded-full border border-line text-mute hover:text-white"
                >
                  ✕
                </button>
              </div>
              {embed && (
                <div className="mb-4 aspect-video overflow-hidden rounded-2xl border border-line bg-ink">
                  <iframe
                    className="size-full"
                    src={embed}
                    title="How to play Guess My Jam"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <ol className="flex flex-col gap-3">
                {STEPS.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-silver">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-jam/50 text-xs font-bold text-jam">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
