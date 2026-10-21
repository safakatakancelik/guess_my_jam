import { useRef, useState } from 'react'
import { HowToPlay } from '../components/HowToPlay'
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
  const [hint, setHint] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // Accepts a bare code or a pasted invite link (…?room=ABCD).
  const parseCode = (raw: string) => {
    const fromLink = raw.match(/room=([a-z]{4})/i)?.[1]
    return (fromLink ?? raw).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)
  }

  const enter = (room: string | null) => {
    if (!name.trim()) {
      setHint('Add a nickname first')
      nameRef.current?.focus()
      return
    }
    if (room !== null && room.length !== 4) {
      setHint('Room codes are 4 letters')
      return
    }
    onEnter(name.trim(), room)
  }

  return (
    <Screen k="home">
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <p className="mt-3 text-mute">Swipe songs. Describe a vibe. Read each other's minds.</p>
          <div className="mt-4">
            <HowToPlay />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-mute" htmlFor="name">
            Your nickname
          </label>
          <input
            id="name"
            value={name}
            maxLength={20}
            ref={nameRef}
            onChange={(e) => {
              setName(e.target.value)
              setHint(null)
            }}
            placeholder="e.g. Funky Pete"
            className="h-13 rounded-2xl border border-line bg-panel px-4 text-lg text-white outline-none placeholder:text-mute/60 focus:border-jam"
          />
          {hint && <p className="text-sm text-ember">{hint}</p>}
          <Button onClick={() => enter(null)} className="mt-2">
            Create a room
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs tracking-widest text-mute uppercase">
          <div className="h-px flex-1 bg-line" /> or join <div className="h-px flex-1 bg-line" />
        </div>

        <div className="flex gap-3">
          <input
            value={code}
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            onChange={(e) => {
              setCode(parseCode(e.target.value))
              setHint(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && enter(code)}
            placeholder="CODE"
            className="h-13 w-full min-w-0 rounded-2xl border border-line bg-panel px-4 text-center text-xl font-bold tracking-[0.4em] text-white uppercase outline-none placeholder:tracking-[0.3em] placeholder:text-mute/50 focus:border-jam"
          />
          <Button variant="ghost" disabled={code.length !== 4} onClick={() => enter(code)}>
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
