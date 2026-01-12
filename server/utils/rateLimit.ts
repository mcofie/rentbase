/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis-based rate limiting
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 5 * 60 * 1000)

interface RateLimitOptions {
    /** Maximum number of requests allowed in the window */
    max: number
    /** Time window in milliseconds */
    windowMs: number
    /** Custom key generator (defaults to IP address) */
    keyGenerator?: (event: any) => string
    /** Custom error message */
    message?: string
}

/**
 * Rate limit middleware for API endpoints
 * @throws 429 error if rate limit exceeded
 */
export async function rateLimit(
    event: any,
    options: RateLimitOptions
): Promise<void> {
    const {
        max = 10,
        windowMs = 60000,
        keyGenerator,
        message = 'Too many requests, please try again later'
    } = options

    // Generate key based on IP and endpoint
    const ip = getRequestHeader(event, 'x-forwarded-for') ||
        getRequestHeader(event, 'x-real-ip') ||
        event.node.req.socket?.remoteAddress ||
        'unknown'

    const path = event.node.req.url || ''
    const key = keyGenerator ? keyGenerator(event) : `${ip}:${path}`

    const now = Date.now()
    const entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetTime) {
        // Create new entry
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        })
        return
    }

    // Increment count
    entry.count++

    if (entry.count > max) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

        throw createError({
            statusCode: 429,
            statusMessage: message,
            data: {
                retryAfter,
                limit: max,
                remaining: 0
            }
        })
    }
}

/**
 * Generate rate limit key for phone-based endpoints
 */
export function phoneRateLimitKey(event: any, phone: string): string {
    const ip = getRequestHeader(event, 'x-forwarded-for') ||
        event.node.req.socket?.remoteAddress ||
        'unknown'
    return `phone:${phone}:${ip}`
}

/**
 * Generate rate limit key for IP only
 */
export function ipRateLimitKey(event: any): string {
    const ip = getRequestHeader(event, 'x-forwarded-for') ||
        event.node.req.socket?.remoteAddress ||
        'unknown'
    const path = event.node.req.url || ''
    return `ip:${ip}:${path}`
}
