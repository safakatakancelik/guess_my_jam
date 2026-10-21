import { createClient, type RealtimeChannel } from '@supabase/supabase-js'
import type { Action, GameState } from './game'

export type Msg =
  | { kind: 'action'; from: string; action: Action }
  | { kind: 'state'; state: GameState }

export interface Room {
  send(msg: Msg): void
  close(): void
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const supabase = url && key ? createClient(url, key) : null

export const usingSupabase = !!supabase

// Supabase Realtime broadcast when configured; otherwise BroadcastChannel so
// two tabs of the same browser can play locally during development.
export function openRoom(code: string, onMsg: (m: Msg) => void): Promise<Room> {
  const name = `gmj-${code}`
  if (!supabase) {
    const bc = new BroadcastChannel(name)
    bc.onmessage = (e) => onMsg(e.data as Msg)
    return Promise.resolve({ send: (m) => bc.postMessage(m), close: () => bc.close() })
  }
  return new Promise((resolve, reject) => {
    const channel: RealtimeChannel = supabase.channel(name, { config: { broadcast: { self: false } } })
    channel.on('broadcast', { event: 'msg' }, ({ payload }) => onMsg(payload as Msg))
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        resolve({
          send: (m) => void channel.send({ type: 'broadcast', event: 'msg', payload: m }),
          close: () => void supabase.removeChannel(channel),
        })
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        reject(new Error(`Realtime ${status}`))
      }
    })
  })
}
