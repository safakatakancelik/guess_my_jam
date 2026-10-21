# Guess My Jam

A two-player music guessing game. One player makes a room and shares its code, and the other joins.

## How it plays

1. Both players hit **Ready**, and the host picks a genre (jazz, EDM, funk, R&B, soul, rock or hip-hop).
2. Each player privately swipes through the same 20 songs: right to like, left to pass.
3. Players take turns. The **expressor** picks one of their liked songs and writes how it makes them feel.
4. The **predictor** reads that and has 30 seconds to pick the right song out of three. A faster correct guess scores more points.
5. One round is two turns, so each player expresses once. The host sets 1–10 rounds.
6. The end screen shows scores and how similar the two players' tastes are.

Songs are a curated list of titles stored as JSON in the repo. There's no audio.

## Stack

React, Vite, Tailwind and Motion, with Supabase Realtime for live play. It deploys as a static site on Netlify.

## Run locally

```bash
cp .env.example .env   # add your Supabase project URL and publishable key
npm install
npm run dev
```

## Deploy

Netlify uses `netlify.toml`. It runs `npm run build` and publishes `dist/`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the site's environment variables.
