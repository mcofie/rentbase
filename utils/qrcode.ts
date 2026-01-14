import QRCode from 'qrcode'

/**
 * Generate a QR code as a data URL
 */
export async function generateQRCode(text: string, size: number = 200): Promise<string> {
    try {
        const qrDataUrl = await QRCode.toDataURL(text, {
            width: size,
            margin: 2,
            color: {
                dark: '#050505',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        })
        return qrDataUrl
    } catch (error) {
        console.error('QR code generation failed:', error)
        throw error
    }
}

/**
 * Generate a QR code as SVG string
 */
export async function generateQRCodeSVG(text: string): Promise<string> {
    try {
        const svg = await QRCode.toString(text, {
            type: 'svg',
            margin: 2,
            color: {
                dark: '#050505',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        })
        return svg
    } catch (error) {
        console.error('QR code SVG generation failed:', error)
        throw error
    }
}
