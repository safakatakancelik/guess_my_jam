import { useMemo, useState } from 'react'
import { Game } from './screens/Game'
import { Home } from './screens/Home'

const store = {
  get(k: string, session = false) {
    try {
      return (session ? sessionStorage : localStorage).getItem(k)
    } catch {
      return null
    }
  },
  set(k: string, v: string, session = false) {
    try {
      ;(session ? sessionStorage : localStorage).setItem(k, v)
    } catch {
      /* storage unavailable */
    }
  },
}

function playerId() {
  let id = store.get('gmj-id', true)
  if (!id) {
    id = crypto.randomUUID()
    store.set('gmj-id', id, true)
  }
  return id
}

function newCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  return Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
}

const setUrlRoom = (code: string | null) =>
  history.replaceState(null, '', code ? `/?room=${code}` : '/')

export function App() {
  const id = useMemo(playerId, [])
  const [session, setSession] = useState<{ name: string; code: string; host: boolean } | null>(null)
  const urlCode = new URLSearchParams(location.search).get('room')?.toUpperCase() ?? ''

  if (!session) {
    return (
      <Home
        initialName={store.get('gmj-name') ?? ''}
        initialCode={urlCode}
        onEnter={(name, code) => {
          store.set('gmj-name', name)
          const room = code ?? newCode()
          setUrlRoom(room)
          setSession({ name, code: room, host: !code })
        }}
      />
    )
  }

  return (
    <Game
      key={`${session.code}-${session.host}`}
      code={session.code}
      me={{ id, name: session.name }}
      isHost={session.host}
      onExit={() => {
        setUrlRoom(null)
        setSession(null)
      }}
    />
  )
}
