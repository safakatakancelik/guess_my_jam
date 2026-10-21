import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { SwipeDeck } from '../components/SwipeDeck'
import { Button, Header, Logo, Screen, SongRow, Waiting } from '../components/ui'
import { GENRES, SONG_BY_ID } from '../data/songs'
import {
  expressorOf,
  GUESS_SECONDS,
  MAX_POINTS,
  pickableSongs,
  predictorOf,
  totalTurns,
  type Action,
  type GameState,
} from '../lib/game'
import { useGame, type Me } from '../lib/useGame'

interface P {
  s: GameState
  me: Me
  dispatch: (a: Action) => void
}

export function Game({ code, me, isHost, onExit }: { code: string; me: Me; isHost: boolean; onExit: () => void }) {
  const { state: s, error, dispatch } = useGame(code, me, isHost)

  if (error && (!s || !s.players.some((p) => p.id === me.id))) {
    return (
      <Screen k="error">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <p className="text-lg text-white">{error}</p>
          <Button variant="ghost" onClick={onExit}>
            Back home
          </Button>
        </div>
      </Screen>
    )
  }
  if (!s || !s.players.some((p) => p.id === me.id)) {
    return (
      <Screen k="connecting">
        <Waiting text={isHost ? 'Opening your room…' : `Joining room ${code}…`} />
      </Screen>
    )
  }

  const props = { s, me, dispatch }
  const key = `${s.phase}-${s.turn}`
  return (
    <>
      {error && (
        <div className="fixed inset-x-0 top-0 z-50 bg-ember py-2 text-center text-sm font-semibold text-ink">{error}</div>
      )}
      <AnimatePresence mode="wait">
        <Screen k={key}>
          <TopBar s={s} onExit={onExit} />
          {s.phase === 'lobby' && <Lobby {...props} />}
          {s.phase === 'genre' && <GenrePick {...props} />}
          {s.phase === 'swipe' && <Swipe {...props} />}
          {s.phase === 'express' && <Express {...props} />}
          {s.phase === 'guess' && <Guess {...props} />}
          {s.phase === 'reveal' && <Reveal {...props} />}
          {s.phase === 'results' && <Results {...props} />}
        </Screen>
      </AnimatePresence>
    </>
  )
}

function TopBar({ s, onExit }: { s: GameState; onExit: () => void }) {
  const inTurns = ['express', 'guess', 'reveal'].includes(s.phase)
  return (
    <div className="mb-6 flex items-center justify-between">
      <Logo small />
      <div className="flex items-center gap-3 text-sm text-mute">
        {inTurns && (
          <span className="rounded-full border border-line px-3 py-1">
            Round {Math.floor(s.turn / 2) + 1}/{s.rounds}
          </span>
        )}
        <button onClick={onExit} className="rounded-full border border-line px-3 py-1 hover:text-white">
          Leave
        </button>
      </div>
    </div>
  )
}

const nameOf = (s: GameState, id: string) => s.players.find((p) => p.id === id)?.name ?? '???'
const other = (s: GameState, me: Me) => s.players.find((p) => p.id !== me.id)

function Lobby({ s, me, dispatch }: P) {
  const isHost = me.id === s.hostId
  const mine = s.players.find((p) => p.id === me.id)!
  const [copied, setCopied] = useState(false)
  const link = `${location.origin}/?room=${s.code}`

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Guess My Jam', text: `Join my room: ${s.code}`, url: link })
      else {
        await navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="rounded-3xl border border-line bg-panel p-6 text-center">
        <p className="text-sm tracking-widest text-mute uppercase">Room code</p>
        <p className="chrome-text my-2 text-6xl font-bold tracking-[0.2em]">{s.code}</p>
        <button onClick={share} className="text-sm font-semibold text-jam">
          {copied ? 'Link copied ✓' : 'Share invite link'}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {[0, 1].map((i) => {
          const p = s.players[i]
          return (
            <div
              key={i}
              className={`flex h-16 items-center justify-between rounded-2xl border px-4 ${p ? 'border-line bg-panel' : 'border-dashed border-line text-mute'}`}
            >
              {p ? (
                <>
                  <span className="font-semibold text-white">
                    {p.name}
                    {p.id === me.id && <span className="text-mute"> (you)</span>}
                    {p.id === s.hostId && <span className="ml-2 text-xs text-mute">HOST</span>}
                  </span>
                  <span className={`text-sm font-semibold ${p.ready ? 'text-jam' : 'text-mute'}`}>
                    {p.ready ? 'Ready ✓' : 'Not ready'}
                  </span>
                </>
              ) : (
                <span>Waiting for a friend to join…</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
        <span className="text-mute">Rounds</span>
        <div className="flex items-center gap-4">
          {isHost && (
            <Stepper onClick={() => dispatch({ type: 'rounds', rounds: s.rounds - 1 })} disabled={s.rounds <= 1}>
              −
            </Stepper>
          )}
          <span className="w-6 text-center text-xl font-bold text-white">{s.rounds}</span>
          {isHost && (
            <Stepper onClick={() => dispatch({ type: 'rounds', rounds: s.rounds + 1 })} disabled={s.rounds >= 10}>
              +
            </Stepper>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-mute">
        Each round, you both take one turn describing a song. {s.rounds * 2} turns total.
      </p>

      <div className="mt-auto pt-8">
        <Button
          className="w-full"
          variant={mine.ready ? 'ghost' : 'jam'}
          onClick={() => dispatch({ type: 'ready', ready: !mine.ready })}
        >
          {mine.ready ? (s.players.length < 2 ? 'Waiting for player 2…' : 'Waiting for them… (tap to unready)') : "I'm ready"}
        </Button>
      </div>
    </div>
  )
}

function Stepper({ children, ...props }: { children: string; onClick: () => void; disabled: boolean }) {
  return (
    <button {...props} className="grid size-9 place-items-center rounded-full border border-line text-lg text-white disabled:opacity-30">
      {children}
    </button>
  )
}

function GenrePick({ s, me, dispatch }: P) {
  const isHost = me.id === s.hostId
  return (
    <div className="flex flex-1 flex-col">
      <Header
        title={isHost ? 'Pick a genre' : `${nameOf(s, s.hostId)} is picking a genre`}
        sub="You'll both swipe the same 20 songs from it."
      />
      <div className="grid grid-cols-2 gap-3">
        {GENRES.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={isHost ? { scale: 0.96 } : undefined}
            disabled={!isHost}
            onClick={() => dispatch({ type: 'genre', genre: g.id })}
            className={`flex h-24 flex-col items-start justify-between rounded-2xl border border-line bg-panel p-4 text-left transition enabled:hover:border-jam disabled:opacity-60 ${i === GENRES.length - 1 ? 'col-span-2' : ''}`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <span className="font-semibold text-white">{g.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Swipe({ s, me, dispatch }: P) {
  const genre = GENRES.find((g) => g.id === s.genre)
  if (s.swipeDone[me.id]) {
    return <Waiting text={`Nice taste. Waiting for ${other(s, me)?.name} to finish swiping…`} />
  }
  return (
    <div className="flex flex-1 flex-col">
      <Header title={`${genre?.emoji} ${genre?.label}`} sub="Private. They won't see your swipes." />
      <SwipeDeck songs={s.deck} onDone={(likes) => dispatch({ type: 'swipes', likes })} />
    </div>
  )
}

function Express({ s, me, dispatch }: P) {
  const expressor = expressorOf(s)
  const [songId, setSongId] = useState<string | null>(null)
  const [text, setText] = useState('')

  if (expressor.id !== me.id) {
    return <Waiting text={`${expressor.name} is picking a song and putting the feeling into words…`} />
  }
  const { liked, fallback } = pickableSongs(s, me.id)
  const list = liked.length ? liked : fallback

  return (
    <div className="flex flex-1 flex-col">
      <Header
        title="Your turn to express"
        sub={liked.length ? 'Pick one of your liked songs.' : "You didn't like any left, so pick any song."}
      />
      <div className="-mx-1 flex max-h-[38dvh] flex-col gap-2 overflow-y-auto px-1 pb-1">
        {list.map((id) => (
          <SongRow key={id} id={id} selected={songId === id} onClick={() => setSongId(id)} />
        ))}
      </div>
      <label className="mt-5 mb-2 text-sm text-mute" htmlFor="vibe">
        How does it make you feel? Don't name it.
      </label>
      <textarea
        id="vibe"
        value={text}
        maxLength={200}
        rows={3}
        onChange={(e) => setText(e.target.value)}
        placeholder="Late-night drive, windows down, heart a little broken…"
        className="resize-none rounded-2xl border border-line bg-panel p-4 text-white outline-none placeholder:text-mute/60 focus:border-jam"
      />
      <div className="mt-auto pt-6">
        <Button
          className="w-full"
          disabled={!songId || text.trim().length < 3}
          onClick={() => songId && dispatch({ type: 'express', songId, text: text.trim() })}
        >
          Send to {predictorOf(s).name}
        </Button>
      </div>
    </div>
  )
}

function useCountdown(seconds: number) {
  const start = useRef(Date.now())
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, seconds - (Date.now() - start.current) / 1000)), 100)
    return () => clearInterval(t)
  }, [seconds])
  return left
}

function Statement({ s, text }: { s: GameState; text: string }) {
  return (
    <div className="rounded-3xl border border-line bg-panel p-5">
      <p className="text-xs tracking-widest text-mute uppercase">{expressorOf(s).name} says</p>
      <p className="mt-2 text-xl leading-snug text-white">“{text}”</p>
    </div>
  )
}

function Guess({ s, me, dispatch }: P) {
  const left = useCountdown(GUESS_SECONDS)
  const [picked, setPicked] = useState<string | null>(null)
  const isPredictor = predictorOf(s).id === me.id
  const sent = useRef(false)
  const cur = s.current!

  const send = (songId: string | null) => {
    if (sent.current) return
    sent.current = true
    setPicked(songId)
    dispatch({ type: 'guess', songId, timeLeft: left })
  }

  useEffect(() => {
    if (isPredictor && left <= 0) send(null)
  })

  const pct = (left / GUESS_SECONDS) * 100
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-raise">
          <div
            className={`h-full rounded-full transition-[width] duration-100 ${left < 8 ? 'bg-ember' : 'bg-jam'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`w-8 text-right font-bold tabular-nums ${left < 8 ? 'text-ember' : 'text-white'}`}>
          {Math.ceil(left)}
        </span>
      </div>
      <Statement s={s} text={cur.text} />
      <p className="mt-6 mb-3 text-sm text-mute">
        {isPredictor
          ? `Which song is it? Faster = more points (up to ${MAX_POINTS}).`
          : `${predictorOf(s).name} is guessing…`}
      </p>
      <div className="flex flex-col gap-2">
        {cur.options.map((id) => (
          <SongRow
            key={id}
            id={id}
            selected={picked === id}
            tone={!isPredictor && id === cur.songId ? 'jam' : undefined}
            onClick={isPredictor && !picked ? () => send(id) : undefined}
            right={
              isPredictor && !picked ? (
                <span className="text-mute">›</span>
              ) : !isPredictor && id === cur.songId ? (
                <span className="text-xs font-semibold text-jam">YOURS</span>
              ) : null
            }
          />
        ))}
      </div>
    </div>
  )
}

function Reveal({ s, me, dispatch }: P) {
  const r = s.results[s.results.length - 1]
  const correct = r.guessId === r.songId
  const waiting = s.nextReady[me.id]
  const isPredictor = r.predictorId === me.id
  const last = s.turn + 1 >= totalTurns(s)

  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="mb-6 text-center"
      >
        <p className={`text-6xl font-bold ${correct ? 'text-jam' : 'text-ember'}`}>
          {correct ? `+${r.points}` : r.guessId ? 'Miss' : "Time's up"}
        </p>
        <p className="mt-2 text-mute">
          {correct
            ? isPredictor
              ? 'You read their mind.'
              : `${nameOf(s, r.predictorId)} got it!`
            : isPredictor
              ? 'Not quite. Here is what it was.'
              : `${nameOf(s, r.predictorId)} didn't get it.`}
        </p>
      </motion.div>
      <Statement s={s} text={r.text} />
      <div className="mt-4 flex flex-col gap-2">
        {r.options.map((id) => (
          <SongRow
            key={id}
            id={id}
            tone={id === r.songId ? 'jam' : id === r.guessId ? 'ember' : 'dim'}
            right={
              id === r.songId ? (
                <span className="text-xs font-semibold text-jam">ANSWER</span>
              ) : id === r.guessId ? (
                <span className="text-xs font-semibold text-ember">GUESS</span>
              ) : null
            }
          />
        ))}
      </div>
      <div className="mt-auto pt-6">
        <Button className="w-full" disabled={waiting} onClick={() => dispatch({ type: 'next' })}>
          {waiting ? `Waiting for ${other(s, me)?.name}…` : last ? 'See results' : 'Next turn'}
        </Button>
      </div>
    </div>
  )
}

function Results({ s, me, dispatch }: P) {
  const isHost = me.id === s.hostId
  const [a, b] = s.players
  const team = s.results.reduce((n, r) => n + r.points, 0)
  const max = s.results.length * MAX_POINTS
  const ratio = max ? team / max : 0
  const title =
    ratio >= 0.7
      ? 'Soulmates 💚'
      : ratio >= 0.45
        ? 'Same wavelength 🎧'
        : ratio >= 0.2
          ? 'Getting in sync 🎶'
          : 'Strangers on the dancefloor 🪩'

  const likesA = new Set(s.likes[a.id] ?? [])
  const likesB = new Set(s.likes[b.id] ?? [])
  const agree = s.deck.filter((id) => likesA.has(id) === likesB.has(id)).length
  const shared = s.deck.filter((id) => likesA.has(id) && likesB.has(id))

  const read = (p: typeof a) => {
    const mine = s.results.filter((r) => r.predictorId === p.id)
    return {
      pts: mine.reduce((n, r) => n + r.points, 0),
      hits: mine.filter((r) => r.guessId === r.songId).length,
      of: mine.length,
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
        <p className="text-sm tracking-widest text-mute uppercase">Sync score</p>
        <p className="chrome-text text-7xl font-bold">{team}</p>
        <p className="mt-1 text-xl font-semibold text-white">{title}</p>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[a, b].map((p) => {
          const r = read(p)
          return (
            <div key={p.id} className="rounded-2xl border border-line bg-panel p-4">
              <p className="truncate text-sm text-mute">{p.name} read the room</p>
              <p className="mt-1 text-3xl font-bold text-jam">{r.pts}</p>
              <p className="text-sm text-mute">
                {r.hits}/{r.of} correct
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-panel p-4">
        <p className="text-sm text-mute">Taste match</p>
        <p className="mt-1 text-white">
          You agreed on <span className="font-bold text-jam">{agree}</span> of {s.deck.length} songs.
        </p>
        {shared.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {shared.map((id) => (
              <span key={id} className="rounded-full border border-jam/40 bg-jam/10 px-3 py-1 text-xs text-jam">
                {SONG_BY_ID[id].title}
              </span>
            ))}
          </div>
        )}
      </div>

      <details className="mt-3 rounded-2xl border border-line bg-panel p-4">
        <summary className="cursor-pointer text-sm text-mute">Turn by turn</summary>
        <ul className="mt-3 flex flex-col gap-3">
          {s.results.map((r, i) => (
            <li key={i} className="text-sm">
              <span className={r.points ? 'text-jam' : 'text-ember'}>{r.points ? `+${r.points}` : '0'}</span>{' '}
              <span className="text-white">{nameOf(s, r.expressorId)}</span>: “{r.text}” →{' '}
              <span className="text-white">{SONG_BY_ID[r.songId].title}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-auto pt-6">
        {isHost ? (
          <Button className="w-full" onClick={() => dispatch({ type: 'again' })}>
            Play again
          </Button>
        ) : (
          <p className="text-center text-mute">Waiting for {nameOf(s, s.hostId)} to start another game…</p>
        )}
      </div>
    </div>
  )
}
