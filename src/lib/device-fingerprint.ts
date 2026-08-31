/**
 * Device fingerprinting utilities for admin login security.
 * Builds a deterministic fingerprint from browser characteristics.
 */

export interface DeviceInfo {
  fingerprint: string
  userAgent: string
  platform: string
  language: string
  timezone: string
  screenResolution: string
  colorDepth: number
  deviceMemory: number | null
  hardwareConcurrency: number
  touchSupport: boolean
  plugins: string
  ip?: string
}

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    userAgentData?: { platform?: string }
  }

  const userAgent = nav.userAgent
  const platform = nav.userAgentData?.platform ?? nav.platform ?? 'unknown'
  const language = nav.language ?? 'unknown'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const screenResolution = `${screen.width}x${screen.height}`
  const colorDepth = screen.colorDepth
  const deviceMemory = nav.deviceMemory ?? null
  const hardwareConcurrency = nav.hardwareConcurrency ?? 1
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const plugins = Array.from(nav.plugins ?? [])
    .map((p) => p.name)
    .sort()
    .join(',')

  const rawFingerprint = [
    userAgent, platform, language, timezone,
    screenResolution, colorDepth, deviceMemory,
    hardwareConcurrency, touchSupport, plugins,
  ].join('|')

  const fingerprint = hashString(rawFingerprint)

  return {
    fingerprint,
    userAgent,
    platform,
    language,
    timezone,
    screenResolution,
    colorDepth,
    deviceMemory,
    hardwareConcurrency,
    touchSupport,
    plugins,
  }
}

export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile'
  if (/tablet|ipad/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}

export function getBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return 'Edge'
  if (/chrome/i.test(userAgent)) return 'Chrome'
  if (/firefox/i.test(userAgent)) return 'Firefox'
  if (/safari/i.test(userAgent)) return 'Safari'
  if (/opera|opr/i.test(userAgent)) return 'Opera'
  return 'Unknown'
}

export function getOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows'
  if (/mac os/i.test(userAgent)) return 'macOS'
  if (/linux/i.test(userAgent)) return 'Linux'
  if (/android/i.test(userAgent)) return 'Android'
  if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS'
  return 'Unknown'
}

/** Score anomalies between two DeviceInfo objects (higher = more suspicious). */
export function computeSuspicionScore(
  stored: Partial<DeviceInfo>,
  current: Partial<DeviceInfo>,
): number {
  let score = 0
  if (stored.fingerprint !== current.fingerprint) score += 50
  if (stored.timezone && current.timezone && stored.timezone !== current.timezone) score += 20
  if (stored.platform && current.platform && stored.platform !== current.platform) score += 15
  if (stored.language && current.language && stored.language !== current.language) score += 10
  return score
}
