import { useCallback, useEffect, useRef, useState } from 'react'
import { initialState, reduce, type Action, type GameState } from './game'
import { openRoom, type Room } from './net'

export interface Me {
  id: string
  name: string
}

// The host's browser owns the GameState: guests send actions, the host reduces
// them and broadcasts the full state (plus a heartbeat so late/lost messages heal).
export function useGame(code: string, me: Me, isHost: boolean) {
  const [state, setState] = useState<GameState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const stateRef = useRef<GameState | null>(null)
  const roomRef = useRef<Room | null>(null)

  useEffect(() => {
    let alive = true
    const timers: number[] = []
    let lastSeen = 0
    const startedAt = Date.now()
    const commit = (s: GameState) => {
      stateRef.current = s
      setState(s)
    }

    openRoom(code, (m) => {
      if (isHost) {
        if (m.kind === 'action' && stateRef.current) {
          const next = reduce(stateRef.current, m.from, m.action)
          if (next !== stateRef.current) commit(next)
          roomRef.current?.send({ kind: 'state', state: next })
        }
      } else if (m.kind === 'state' && m.state.code === code) {
        lastSeen = Date.now()
        commit(m.state)
      }
    })
      .then((room) => {
        if (!alive) return room.close()
        roomRef.current = room
        if (isHost) {
          const s = initialState(code, me.id, me.name)
          commit(s)
          timers.push(window.setInterval(() => stateRef.current && room.send({ kind: 'state', state: stateRef.current }), 3000))
          return
        }
        const inRoom = () => !!stateRef.current?.players.some((p) => p.id === me.id)
        const join = () => room.send({ kind: 'action', from: me.id, action: { type: 'join', name: me.name } })
        join()
        timers.push(
          window.setInterval(() => {
            const s = stateRef.current
            if (!s) {
              if (Date.now() - startedAt > 8000) setError('Room not found. Check the code?')
              else join()
              return
            }
            if (!inRoom()) {
              if (s.players.length >= 2 || s.phase !== 'lobby') setError('That room is full or already playing.')
              else join()
            } else if (Date.now() - lastSeen > 12000) {
              setError('Lost connection to the host.')
            } else {
              setError(null)
            }
          }, 1500),
        )
      })
      .catch((e: Error) => setError(e.message))

    const leave = () => {
      if (!isHost) roomRef.current?.send({ kind: 'action', from: me.id, action: { type: 'leave' } })
    }
    window.addEventListener('beforeunload', leave)
    return () => {
      alive = false
      timers.forEach(clearInterval)
      window.removeEventListener('beforeunload', leave)
      leave()
      roomRef.current?.close()
      roomRef.current = null
    }
  }, [code, me.id, me.name, isHost])

  const dispatch = useCallback(
    (action: Action) => {
      const room = roomRef.current
      if (!room) return
      if (isHost) {
        if (!stateRef.current) return
        const next = reduce(stateRef.current, me.id, action)
        stateRef.current = next
        setState(next)
        room.send({ kind: 'state', state: next })
      } else {
        room.send({ kind: 'action', from: me.id, action })
      }
    },
    [isHost, me.id],
  )

  return { state, error, dispatch }
}
