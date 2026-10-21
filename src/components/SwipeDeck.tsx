import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useState } from 'react'
import { SONG_BY_ID } from '../data/songs'
import { hueOf, Vinyl } from './ui'

const THRESHOLD = 110

export function SwipeDeck({ songs, onDone }: { songs: string[]; onDone: (likes: string[]) => void }) {
  const [index, setIndex] = useState(0)
  const [likes, setLikes] = useState<string[]>([])

  const decide = (liked: boolean) => {
    const id = songs[index]
    const nextLikes = liked ? [...likes, id] : likes
    setLikes(nextLikes)
    if (index + 1 >= songs.length) onDone(nextLikes)
    setIndex(index + 1)
  }

  const visible = songs.slice(index, index + 3)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between text-sm text-mute">
        <span>
          {Math.min(index + 1, songs.length)} / {songs.length}
        </span>
        <span>
          <span className="text-jam">♥ {likes.length}</span> liked
        </span>
      </div>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-raise">
        <motion.div className="h-full bg-jam" animate={{ width: `${(index / songs.length) * 100}%` }} />
      </div>

      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm flex-none">
        {visible
          .map((id, i) => <Card key={id} id={id} depth={i} onDecide={decide} />)
          .reverse()}
      </div>

      <div className="mt-6 flex items-center justify-center gap-8">
        <RoundButton label="Nope" onClick={() => decide(false)} className="border-ember text-ember">
          ✕
        </RoundButton>
        <RoundButton label="Like" onClick={() => decide(true)} className="border-jam text-jam">
          ♥
        </RoundButton>
      </div>
      <p className="mt-3 text-center text-xs text-mute">Swipe right if you vibe with it, left if not.</p>
    </div>
  )
}

function RoundButton({
  children,
  label,
  onClick,
  className,
}: {
  children: string
  label: string
  onClick: () => void
  className: string
}) {
  return (
    <motion.button
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={`grid size-16 place-items-center rounded-full border-2 bg-panel text-2xl ${className}`}
    >
      {children}
    </motion.button>
  )
}

function Card({ id, depth, onDecide }: { id: string; depth: number; onDecide: (liked: boolean) => void }) {
  const song = SONG_BY_ID[id]
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-14, 14])
  const likeOpacity = useTransform(x, [20, THRESHOLD], [0, 1])
  const nopeOpacity = useTransform(x, [-THRESHOLD, -20], [1, 0])
  const hue = hueOf(id)
  const top = depth === 0

  const fling = (dir: 1 | -1) => {
    animate(x, dir * 500, { duration: 0.25 }).then(() => onDecide(dir === 1))
  }

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={{ x, rotate, zIndex: 10 - depth }}
      initial={false}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 1 ? 0.6 : 1 }}
      drag={top ? 'x' : false}
      onDragEnd={(_, info) => {
        if (info.offset.x > THRESHOLD || info.velocity.x > 600) fling(1)
        else if (info.offset.x < -THRESHOLD || info.velocity.x < -600) fling(-1)
        else animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
      }}
    >
      <div
        className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line p-6 shadow-2xl"
        style={{
          background: `radial-gradient(120% 70% at 50% 0%, hsl(${hue} 60% 22%), #141619 70%)`,
        }}
      >
        <div className="flex justify-between">
          <motion.span
            style={{ opacity: likeOpacity }}
            className="rounded-lg border-2 border-jam px-3 py-1 text-xl font-bold text-jam"
          >
            LIKE
          </motion.span>
          <motion.span
            style={{ opacity: nopeOpacity }}
            className="rounded-lg border-2 border-ember px-3 py-1 text-xl font-bold text-ember"
          >
            NOPE
          </motion.span>
        </div>
        <div className="flex justify-center">
          <Vinyl hue={hue} size={170} spin={top} />
        </div>
        <div>
          <h2 className="text-3xl leading-tight font-bold text-white">{song.title}</h2>
          <p className="mt-1 text-lg text-silver/80">{song.artist}</p>
        </div>
      </div>
    </motion.div>
  )
}
