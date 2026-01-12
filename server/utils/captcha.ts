/**
 * Anti-Spam / CAPTCHA Verification Utilities
 * 
 * Implements multiple layers of spam protection:
 * 1. Honeypot field detection (bots fill hidden fields)
 * 2. Time-based validation (forms submitted too fast are suspicious)
 * 3. Cloudflare Turnstile CAPTCHA verification (optional)
 */

interface SpamCheckResult {
    isSpam: boolean
    reason?: string
}

interface TurnstileVerifyResponse {
    success: boolean
    'error-codes'?: string[]
    challenge_ts?: string
    hostname?: string
}

/**
 * Verify Cloudflare Turnstile CAPTCHA token
 * @param token - The token from the Turnstile widget
 * @param secretKey - Turnstile secret key (from environment)
 * @param ip - Optional remote IP for additional validation
 */
export async function verifyTurnstile(
    token: string,
    secretKey: string,
    ip?: string
): Promise<{ success: boolean; error?: string }> {
    if (!token) {
        return { success: false, error: 'Missing CAPTCHA token' }
    }

    if (!secretKey || secretKey === 'placeholder') {
        // If Turnstile not configured, skip verification (development mode)
        console.warn('Turnstile secret key not configured - skipping CAPTCHA verification')
        return { success: true }
    }

    try {
        const formData = new FormData()
        formData.append('secret', secretKey)
        formData.append('response', token)
        if (ip) {
            formData.append('remoteip', ip)
        }

        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        })

        const result: TurnstileVerifyResponse = await response.json()

        if (result.success) {
            return { success: true }
        }

        const errorMessages: Record<string, string> = {
            'missing-input-secret': 'CAPTCHA configuration error',
            'invalid-input-secret': 'CAPTCHA configuration error',
            'missing-input-response': 'Please complete the CAPTCHA',
            'invalid-input-response': 'CAPTCHA verification failed',
            'bad-request': 'Invalid CAPTCHA request',
            'timeout-or-duplicate': 'CAPTCHA expired. Please try again',
        }

        const errorCode = result['error-codes']?.[0] || 'unknown'
        const errorMessage = errorMessages[errorCode] || 'CAPTCHA verification failed'

        return { success: false, error: errorMessage }
    } catch (error) {
        console.error('Turnstile verification error:', error)
        return { success: false, error: 'CAPTCHA verification failed' }
    }
}

/**
 * Check for honeypot field (should always be empty for legitimate users)
 * @param honeypotValue - Value of the honeypot field
 */
export function checkHoneypot(honeypotValue: string | undefined | null): SpamCheckResult {
    if (honeypotValue && honeypotValue.length > 0) {
        return { isSpam: true, reason: 'Bot detected (honeypot)' }
    }
    return { isSpam: false }
}

/**
 * Check if form was submitted too quickly (bots submit instantly)
 * @param formLoadTime - Timestamp when form was loaded (milliseconds)
 * @param minTimeMs - Minimum time expected to fill form (default 3 seconds)
 */
export function checkSubmissionTime(
    formLoadTime: number | undefined,
    minTimeMs: number = 3000
): SpamCheckResult {
    if (!formLoadTime) {
        // If no timestamp provided, skip this check
        return { isSpam: false }
    }

    const elapsed = Date.now() - formLoadTime

    if (elapsed < minTimeMs) {
        return { isSpam: true, reason: 'Form submitted too quickly' }
    }

    return { isSpam: false }
}

/**
 * Comprehensive spam check combining multiple methods
 */
export async function performSpamCheck(options: {
    honeypotValue?: string | null
    formLoadTime?: number
    turnstileToken?: string
    turnstileSecret?: string
    clientIp?: string
    minSubmitTime?: number
}): Promise<SpamCheckResult> {
    const {
        honeypotValue,
        formLoadTime,
        turnstileToken,
        turnstileSecret,
        clientIp,
        minSubmitTime = 3000,
    } = options

    // 1. Check honeypot
    const honeypotResult = checkHoneypot(honeypotValue)
    if (honeypotResult.isSpam) {
        console.log('[Spam Check] Honeypot triggered')
        return honeypotResult
    }

    // 2. Check submission timing
    const timingResult = checkSubmissionTime(formLoadTime, minSubmitTime)
    if (timingResult.isSpam) {
        console.log('[Spam Check] Timing check failed')
        return timingResult
    }

    // 3. Verify Turnstile CAPTCHA if configured
    if (turnstileToken && turnstileSecret) {
        const turnstileResult = await verifyTurnstile(turnstileToken, turnstileSecret, clientIp)
        if (!turnstileResult.success) {
            return { isSpam: true, reason: turnstileResult.error || 'CAPTCHA verification failed' }
        }
    }

    return { isSpam: false }
}
