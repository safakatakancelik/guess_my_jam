import { motion } from 'motion/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { SONG_BY_ID } from '../data/songs'

export function Screen({ children, k }: { children: ReactNode; k: string }) {
  return (
    <motion.main
      key={k}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-6 pb-8"
    >
      {children}
    </motion.main>
  )
}

type Variant = 'jam' | 'ghost' | 'ember'
export function Button({
  variant = 'jam',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    jam: 'bg-jam text-ink shadow-[0_0_24px_rgb(62_224_143/0.25)] hover:brightness-110',
    ember: 'bg-ember text-ink hover:brightness-110',
    ghost: 'border border-line bg-raise text-silver hover:border-mute',
  }
  return (
    <button
      {...props}
      className={`h-13 rounded-2xl px-5 text-base font-semibold transition active:scale-[0.98] disabled:opacity-35 disabled:shadow-none ${styles[variant]} ${className}`}
    />
  )
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${small ? 'text-lg' : 'text-4xl'} font-bold tracking-tight`}>
      <Vinyl hue={150} size={small ? 22 : 40} spin />
      <span className="chrome-text">
        Guess My <span className="text-jam">Jam</span>
      </span>
    </div>
  )
}

export function hueOf(id: string) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 360
}

export function Vinyl({ hue, size = 48, spin = false }: { hue: number; size?: number; spin?: boolean }) {
  return (
    <div
      className={`relative shrink-0 rounded-full ${spin ? 'animate-[spin_6s_linear_infinite]' : ''}`}
      style={{
        width: size,
        height: size,
        background: 'repeating-radial-gradient(circle, #16181b 0 2px, #0c0d0f 2px 4px)',
        boxShadow: 'inset 0 0 0 1px #2a2e34',
      }}
    >
      <div
        className="absolute inset-[32%] rounded-full"
        style={{ background: `linear-gradient(135deg, hsl(${hue} 80% 62%), hsl(${(hue + 40) % 360} 70% 45%))` }}
      />
      <div className="absolute inset-[47%] rounded-full bg-ink" />
    </div>
  )
}

export function SongRow({
  id,
  selected,
  onClick,
  tone,
  right,
}: {
  id: string
  selected?: boolean
  onClick?: () => void
  tone?: 'jam' | 'ember' | 'dim'
  right?: ReactNode
}) {
  const song = SONG_BY_ID[id]
  if (!song) return null
  const border =
    tone === 'jam'
      ? 'border-jam bg-jam/10'
      : tone === 'ember'
        ? 'border-ember bg-ember/10'
        : selected
          ? 'border-jam bg-jam/10'
          : 'border-line bg-panel'
  return (
    <motion.button
      layout
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={!onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-default ${border} ${tone === 'dim' ? 'opacity-40' : ''}`}
    >
      <Vinyl hue={hueOf(id)} size={44} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-white">{song.title}</div>
        <div className="truncate text-sm text-mute">{song.artist}</div>
      </div>
      {right}
    </motion.button>
  )
}

export function Waiting({ text }: { text: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center text-mute">
      <Vinyl hue={150} size={88} spin />
      <p className="max-w-60">{text}</p>
    </div>
  )
}

export function Header({ title, sub }: { title: string; sub?: ReactNode }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {sub && <p className="mt-1 text-mute">{sub}</p>}
    </div>
  )
}
