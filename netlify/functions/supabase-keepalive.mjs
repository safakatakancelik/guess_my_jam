// Daily ping so the free-tier Supabase project never hits the 7-day inactivity pause.
// Reads the one-row table created by supabase/keepalive.sql.
export default async () => {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('keepalive: missing VITE_SUPABASE_URL or publishable key')
    return new Response('missing env', { status: 500 })
  }

  const res = await fetch(`${url}/rest/v1/keepalive?select=id&limit=1`, { headers: { apikey: key } })
  const body = await res.text()
  console.log(`keepalive: HTTP ${res.status} ${body}`)
  return new Response(body, { status: res.ok ? 200 : 502 })
}

export const config = { schedule: '@daily' }
