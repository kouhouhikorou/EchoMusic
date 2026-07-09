const DISCLAIMER_KEY = 'echomusic-disclaimer-accepted'

export function hasAcceptedDisclaimer(): boolean {
  return localStorage.getItem(DISCLAIMER_KEY) === 'true'
}

export function acceptDisclaimer(dontShowAgain: boolean) {
  if (dontShowAgain) {
    localStorage.setItem(DISCLAIMER_KEY, 'true')
  }
}

export function resetDisclaimer() {
  localStorage.removeItem(DISCLAIMER_KEY)
}
