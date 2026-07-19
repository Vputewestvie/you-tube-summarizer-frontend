const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/|embed\/)|youtu\.be\/)[\w-]{6,}([&?].*)?$/i

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url.trim())
}

export function extractVideoId(url: string): string | null {
  const trimmed = url.trim()
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /shorts\/([\w-]{11})/,
    /live\/([\w-]{11})/,
    /embed\/([\w-]{11})/,
  ]
  for (const p of patterns) {
    const match = trimmed.match(p)
    if (match) return match[1]
  }
  return null
}
