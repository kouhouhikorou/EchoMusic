/**
 * LRC Lyrics Parser
 * Supports standard LRC format: [mm:ss.xx]text
 * Supports enhanced LRC with word-level timing: <mm:ss.xx>word
 */

export interface LyricLine {
  time: number       // seconds
  text: string
  words?: { time: number; text: string }[]  // word-level timing
}

export function parseLRC(lrc: string): LyricLine[] {
  const lines: LyricLine[] = []
  const lineRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g
  const wordRegex = /<(\d{2}):(\d{2})\.(\d{2,3})>/g

  for (const raw of lrc.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    // Extract all timestamps
    const timestamps: number[] = []
    let match: RegExpExecArray | null
    const lineRegexClone = new RegExp(lineRegex.source, 'g')

    while ((match = lineRegexClone.exec(line)) !== null) {
      const min = parseInt(match[1])
      const sec = parseInt(match[2])
      const ms = match[3].length === 2 ? parseInt(match[3]) * 10 : parseInt(match[3])
      timestamps.push(min * 60 + sec + ms / 1000)
    }

    if (timestamps.length === 0) continue

    // Get text (remove all timestamp tags)
    let text = line.replace(lineRegex, '').trim()
    // Also remove word-level timing tags for display text
    text = text.replace(wordRegex, '').trim()

    // Parse word-level timings
    const words: { time: number; text: string }[] = []
    const wordRegexClone = new RegExp(wordRegex.source, 'g')
    let wordMatch: RegExpExecArray | null
    let lastIdx = 0
    const rawText = line.replace(lineRegex, '').trim()

    while ((wordMatch = wordRegexClone.exec(rawText)) !== null) {
      const wMin = parseInt(wordMatch[1])
      const wSec = parseInt(wordMatch[2])
      const wMs = wordMatch[3].length === 2 ? parseInt(wordMatch[3]) * 10 : parseInt(wordMatch[3])
      const wTime = wMin * 60 + wSec + wMs / 1000

      const textBefore = rawText.slice(lastIdx, wordMatch.index).replace(wordRegex, '').trim()
      if (textBefore) {
        words.push({ time: wTime, text: textBefore })
      }
      lastIdx = wordMatch.index + wordMatch[0].length
    }

    const remaining = rawText.slice(lastIdx).replace(wordRegex, '').trim()
    if (remaining) {
      words.push({ time: timestamps[0], text: remaining })
    }

    for (const time of timestamps) {
      lines.push({ time, text, words: words.length > 0 ? words : undefined })
    }
  }

  // Sort by time
  lines.sort((a, b) => a.time - b.time)
  return lines
}

/**
 * Find current lyric line index based on current time in seconds
 */
export function findCurrentLine(lines: LyricLine[], currentTime: number): number {
  if (lines.length === 0) return -1
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].time <= currentTime) return i
  }
  return 0
}

/**
 * Check if lyric text is empty / placeholder
 */
export function isEmptyLyric(lyric: string): boolean {
  return !lyric || lyric.trim() === '' || lyric.includes('纯音乐') || lyric.includes('暂无歌词')
}
