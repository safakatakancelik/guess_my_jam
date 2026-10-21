import { SONGS, type GenreId } from '../data/songs'

export const DECK_SIZE = 20
export const GUESS_SECONDS = 30
export const MAX_POINTS = 100

export type Phase = 'lobby' | 'genre' | 'swipe' | 'express' | 'guess' | 'reveal' | 'results'

export interface Player {
  id: string
  name: string
  ready: boolean
}

export interface TurnResult {
  expressorId: string
  predictorId: string
  songId: string
  text: string
  options: string[]
  guessId: string | null
  points: number
}

export interface GameState {
  code: string
  hostId: string
  players: Player[]
  rounds: number
  phase: Phase
  genre: GenreId | null
  deck: string[]
  likes: Record<string, string[]>
  swipeDone: Record<string, boolean>
  turn: number
  current: { songId: string; text: string; options: string[] } | null
  results: TurnResult[]
  nextReady: Record<string, boolean>
}

export type Action =
  | { type: 'join'; name: string }
  | { type: 'leave' }
  | { type: 'ready'; ready: boolean }
  | { type: 'rounds'; rounds: number }
  | { type: 'genre'; genre: GenreId }
  | { type: 'swipes'; likes: string[] }
  | { type: 'express'; songId: string; text: string }
  | { type: 'guess'; songId: string | null; timeLeft: number }
  | { type: 'next' }
  | { type: 'again' }

export function initialState(code: string, hostId: string, name: string): GameState {
  return {
    code,
    hostId,
    players: [{ id: hostId, name, ready: false }],
    rounds: 3,
    phase: 'lobby',
    genre: null,
    deck: [],
    likes: {},
    swipeDone: {},
    turn: 0,
    current: null,
    results: [],
    nextReady: {},
  }
}

// Players alternate: turn 0 → host expresses, turn 1 → guest, ...
export const expressorOf = (s: GameState) => s.players[s.turn % 2]
export const predictorOf = (s: GameState) => s.players[(s.turn + 1) % 2]
export const totalTurns = (s: GameState) => s.rounds * 2

export function pointsFor(timeLeft: number) {
  return Math.max(10, Math.round((MAX_POINTS * Math.min(timeLeft, GUESS_SECONDS)) / GUESS_SECONDS))
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const resetRound = (s: GameState): GameState => ({
  ...s,
  genre: null,
  deck: [],
  likes: {},
  swipeDone: {},
  turn: 0,
  current: null,
  results: [],
  nextReady: {},
})

// Host-authoritative reducer. Invalid actions return the state unchanged.
export function reduce(s: GameState, from: string, a: Action): GameState {
  const isHost = from === s.hostId
  switch (a.type) {
    case 'join': {
      if (s.players.some((p) => p.id === from)) return s
      if (s.players.length >= 2 || s.phase !== 'lobby') return s
      return { ...s, players: [...s.players, { id: from, name: a.name.slice(0, 20), ready: false }] }
    }
    case 'leave': {
      if (!s.players.some((p) => p.id === from)) return s
      const players = s.players.filter((p) => p.id !== from).map((p) => ({ ...p, ready: false }))
      return { ...resetRound(s), players, phase: 'lobby' }
    }
    case 'ready': {
      if (s.phase !== 'lobby') return s
      const players = s.players.map((p) => (p.id === from ? { ...p, ready: a.ready } : p))
      const allReady = players.length === 2 && players.every((p) => p.ready)
      return { ...s, players, phase: allReady ? 'genre' : 'lobby' }
    }
    case 'rounds': {
      if (!isHost || s.phase !== 'lobby') return s
      return { ...s, rounds: Math.min(10, Math.max(1, a.rounds)) }
    }
    case 'genre': {
      if (!isHost || s.phase !== 'genre') return s
      const pool = SONGS.filter((x) => x.genre === a.genre).map((x) => x.id)
      return { ...resetRound(s), genre: a.genre, deck: shuffle(pool).slice(0, DECK_SIZE), phase: 'swipe' }
    }
    case 'swipes': {
      if (s.phase !== 'swipe') return s
      const likes = { ...s.likes, [from]: a.likes.filter((id) => s.deck.includes(id)) }
      const swipeDone = { ...s.swipeDone, [from]: true }
      const allDone = s.players.every((p) => swipeDone[p.id])
      return { ...s, likes, swipeDone, phase: allDone ? 'express' : 'swipe' }
    }
    case 'express': {
      if (s.phase !== 'express' || from !== expressorOf(s).id || !s.deck.includes(a.songId)) return s
      const decoys = shuffle(s.deck.filter((id) => id !== a.songId)).slice(0, 2)
      const current = { songId: a.songId, text: a.text.slice(0, 200), options: shuffle([a.songId, ...decoys]) }
      return { ...s, current, phase: 'guess' }
    }
    case 'guess': {
      if (s.phase !== 'guess' || !s.current || from !== predictorOf(s).id) return s
      const correct = a.songId === s.current.songId
      const result: TurnResult = {
        expressorId: expressorOf(s).id,
        predictorId: from,
        songId: s.current.songId,
        text: s.current.text,
        options: s.current.options,
        guessId: a.songId,
        points: correct ? pointsFor(a.timeLeft) : 0,
      }
      return { ...s, results: [...s.results, result], phase: 'reveal', nextReady: {} }
    }
    case 'next': {
      if (s.phase !== 'reveal') return s
      const nextReady = { ...s.nextReady, [from]: true }
      if (!s.players.every((p) => nextReady[p.id])) return { ...s, nextReady }
      const turn = s.turn + 1
      if (turn >= totalTurns(s)) return { ...s, nextReady, turn, phase: 'results', current: null }
      return { ...s, nextReady: {}, turn, phase: 'express', current: null }
    }
    case 'again': {
      if (!isHost || s.phase !== 'results') return s
      return { ...resetRound(s), phase: 'genre' }
    }
  }
}

// Songs the expressor may pick this turn: their likes not used yet, else any unused deck song.
export function pickableSongs(s: GameState, playerId: string) {
  const used = new Set(s.results.map((r) => r.songId))
  const liked = (s.likes[playerId] ?? []).filter((id) => !used.has(id))
  return { liked, fallback: liked.length === 0 ? s.deck.filter((id) => !used.has(id)) : [] }
}
