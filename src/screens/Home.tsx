import { useState } from 'react'
import { Button, Logo, Screen } from '../components/ui'
import { usingSupabase } from '../lib/net'

export function Home({
  initialName,
  initialCode,
  onEnter,
}: {
  initialName: string
  initialCode: string
  onEnter: (name: string, code: string | null) => void
}) {
  const [name, setName] = useState(initialName)
  const [code, setCode] = useState(initialCode)
  const ok = name.trim().length > 0

  return (
    <Screen k="home">
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <p className="mt-3 text-mute">Swipe songs. Describe a vibe. Read each other's minds.</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-mute" htmlFor="name">
            Your nickname
          </label>
          <input
            id="name"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Funky Pete"
            className="h-13 rounded-2xl border border-line bg-panel px-4 text-lg text-white outline-none placeholder:text-mute/60 focus:border-jam"
          />
          <Button disabled={!ok} onClick={() => onEnter(name.trim(), null)} className="mt-2">
            Create a room
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs tracking-widest text-mute uppercase">
          <div className="h-px flex-1 bg-line" /> or join <div className="h-px flex-1 bg-line" />
        </div>

        <div className="flex gap-3">
          <input
            value={code}
            maxLength={4}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            placeholder="CODE"
            className="h-13 w-full min-w-0 rounded-2xl border border-line bg-panel px-4 text-center text-xl font-bold tracking-[0.4em] text-white uppercase outline-none placeholder:tracking-[0.3em] placeholder:text-mute/50 focus:border-jam"
          />
          <Button variant="ghost" disabled={!ok || code.length !== 4} onClick={() => onEnter(name.trim(), code)}>
            Join
          </Button>
        </div>
      </div>
      {!usingSupabase && (
        <p className="text-center text-xs text-ember/80">Local mode: no Supabase keys, play across tabs of this browser.</p>
      )}
    </Screen>
  )
}
