import type { Song } from '@/stores/playerStore'

/**
 * Parse ID3 tags from an audio file using music-metadata-browser
 */
export async function parseAudioFile(file: File): Promise<{
  metadata: Partial<Song>
  coverBlob?: Blob
}> {
  try {
    // Dynamic import to avoid issues with SSR
    const { parseBlob } = await import('music-metadata-browser')

    const metadata = await parseBlob(file)
    const common = metadata.common
    const format = metadata.format

    // Extract cover art
    let coverBlob: Blob | undefined
    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0]
      coverBlob = new Blob([pic.data], { type: pic.format })
    }

    return {
      metadata: {
        title: common.title || file.name.replace(/\.[^.]+$/, ''),
        artist: common.artist || '未知歌手',
        album: common.album || '未知专辑',
        duration: format.duration || 0,
        format: format.container || file.name.split('.').pop(),
      },
      coverBlob,
    }
  } catch {
    // Fallback: use filename as title
    return {
      metadata: {
        title: file.name.replace(/\.[^.]+$/, ''),
        artist: '未知歌手',
        album: '未知专辑',
        duration: 0,
        format: file.name.split('.').pop(),
      },
    }
  }
}

/**
 * Convert File to base64 data URL (for local playback)
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Create an object URL for a file (for local playback)
 */
export function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Supported audio formats
 */
export const SUPPORTED_FORMATS = ['.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma', '.ape']

export function isAudioFile(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return SUPPORTED_FORMATS.includes(ext)
}
