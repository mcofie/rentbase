/**
 * Format Ghana phone numbers to E.164 format
 * @param phone - The phone number to format
 * @returns Formatted phone number in E.164 format
 */
export function formatPhoneE164(phone: string): string {
    // Remove all non-digits
    let digits = phone.replace(/\D/g, '')

    // Handle case where someone typed +233 followed by local format (02XX...)
    // e.g., +2330276251608 should become +233276251608
    if (digits.startsWith('2330') && digits.length === 13) {
        digits = '233' + digits.slice(4) // Remove the extra 0
    }

    // If starts with 0, replace with +233
    if (digits.startsWith('0')) {
        return `+233${digits.slice(1)}`
    }

    // If starts with 233, add +
    if (digits.startsWith('233')) {
        return `+${digits}`
    }

    // If 9 digits, assume local number
    if (digits.length === 9) {
        return `+233${digits}`
    }

    // If already has +, return as is
    if (phone.startsWith('+')) {
        return phone
    }

    return `+${digits}`
}

/**
 * Validate Ghana phone number format
 * @param phone - The phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export function isValidGhanaPhone(phone: string): boolean {
    const formatted = formatPhoneE164(phone)
    // Ghana phone numbers: +233 followed by 9 digits
    const ghanaPhoneRegex = /^\+233\d{9}$/
    return ghanaPhoneRegex.test(formatted)
}

/**
 * Format phone number for display
 * @param phone - The phone number in E.164 format
 * @returns Formatted phone number for display
 */
export function formatPhoneDisplay(phone: string): string {
    const digits = phone.replace(/\D/g, '')

    if (digits.length === 12 && digits.startsWith('233')) {
        // Format as +233 XX XXX XXXX
        return `+233 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    }

    return phone
}
