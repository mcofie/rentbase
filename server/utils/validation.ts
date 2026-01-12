/**
 * Input validation utilities using Zod-like validation
 * Provides type-safe validation for API inputs
 */

/**
 * Validate and sanitize phone number (Ghana format)
 */
export function validatePhone(phone: string): { valid: boolean; value: string; error?: string } {
    if (!phone || typeof phone !== 'string') {
        return { valid: false, value: '', error: 'Phone number is required' }
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')

    // Check for valid Ghana phone patterns
    // 0XX XXX XXXX (10 digits starting with 0)
    // 233XXXXXXXXX (12 digits starting with 233)
    // XXXXXXXXX (9 digits without prefix)

    let normalized: string

    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        normalized = '+233' + cleaned.slice(1)
    } else if (cleaned.length === 12 && cleaned.startsWith('233')) {
        normalized = '+' + cleaned
    } else if (cleaned.length === 9) {
        normalized = '+233' + cleaned
    } else {
        return { valid: false, value: '', error: 'Invalid Ghana phone number format' }
    }

    // Validate network prefixes (Ghana mobile networks)
    const networkPrefix = normalized.slice(4, 6)
    const validPrefixes = ['20', '23', '24', '25', '26', '27', '28', '29', '50', '53', '54', '55', '56', '57', '59']

    if (!validPrefixes.includes(networkPrefix)) {
        return { valid: false, value: '', error: 'Invalid Ghana mobile network prefix' }
    }

    return { valid: true, value: normalized }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): { valid: boolean; value: string; error?: string } {
    if (!email || typeof email !== 'string') {
        return { valid: false, value: '', error: 'Email is required' }
    }

    const trimmed = email.trim().toLowerCase()

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmed)) {
        return { valid: false, value: '', error: 'Invalid email format' }
    }

    if (trimmed.length > 254) {
        return { valid: false, value: '', error: 'Email too long' }
    }

    return { valid: true, value: trimmed }
}

/**
 * Validate and sanitize text input (for comments, descriptions, etc.)
 */
export function validateText(
    text: string,
    options: { maxLength?: number; minLength?: number; required?: boolean } = {}
): { valid: boolean; value: string; error?: string } {
    const { maxLength = 2000, minLength = 0, required = false } = options

    if (!text || typeof text !== 'string') {
        if (required) {
            return { valid: false, value: '', error: 'This field is required' }
        }
        return { valid: true, value: '' }
    }

    // Sanitize: trim whitespace, remove null bytes, normalize unicode
    let sanitized = text
        .trim()
        .replace(/\0/g, '') // Remove null bytes
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
        .slice(0, maxLength) // Enforce max length

    if (required && sanitized.length < minLength) {
        return { valid: false, value: '', error: `Minimum ${minLength} characters required` }
    }

    return { valid: true, value: sanitized }
}

/**
 * Validate rating (1-5)
 */
export function validateRating(rating: any): { valid: boolean; value: number; error?: string } {
    const num = Number(rating)

    if (isNaN(num) || !Number.isInteger(num)) {
        return { valid: false, value: 0, error: 'Rating must be a whole number' }
    }

    if (num < 1 || num > 5) {
        return { valid: false, value: 0, error: 'Rating must be between 1 and 5' }
    }

    return { valid: true, value: num }
}

/**
 * Validate OTP code
 */
export function validateOtpCode(code: string): { valid: boolean; value: string; error?: string } {
    if (!code || typeof code !== 'string') {
        return { valid: false, value: '', error: 'Code is required' }
    }

    const cleaned = code.replace(/\D/g, '')

    if (cleaned.length !== 4) {
        return { valid: false, value: '', error: 'Code must be 4 digits' }
    }

    return { valid: true, value: cleaned }
}

/**
 * Validate UUID
 */
export function validateUuid(uuid: string): { valid: boolean; value: string; error?: string } {
    if (!uuid || typeof uuid !== 'string') {
        return { valid: false, value: '', error: 'ID is required' }
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(uuid)) {
        return { valid: false, value: '', error: 'Invalid ID format' }
    }

    return { valid: true, value: uuid.toLowerCase() }
}

/**
 * Sanitize object for database insertion
 * Removes undefined values and sanitizes strings
 */
export function sanitizeForDb<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: Partial<T> = {}

    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) continue

        if (typeof value === 'string') {
            result[key as keyof T] = value.trim().replace(/\0/g, '') as any
        } else {
            result[key as keyof T] = value
        }
    }

    return result
}
