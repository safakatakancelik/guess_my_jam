// "How to play" video. Set VITE_HOWTO_VIDEO_URL in Netlify (then redeploy) to change it
// without touching code; otherwise this fallback is used. Leave both empty to hide the video.
const FALLBACK_HOWTO_VIDEO_URL = ''

export const HOWTO_VIDEO_URL: string =
  (import.meta.env.VITE_HOWTO_VIDEO_URL as string | undefined) || FALLBACK_HOWTO_VIDEO_URL

// Accepts watch?v=, youtu.be/, /shorts/ and /embed/ links; returns a privacy-friendly embed URL.
export function youtubeEmbed(url: string): string | null {
  const id = url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1]
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null
}
