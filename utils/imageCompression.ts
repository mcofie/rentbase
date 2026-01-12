/**
 * Client-side image compression utility
 * Compresses images before upload to reduce storage costs and upload time
 */

interface CompressOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number // 0.0 to 1.0
    maxSizeMB?: number
}

const DEFAULT_OPTIONS: CompressOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    maxSizeMB: 2
}

/**
 * Compress an image file before upload
 * @param file - Original file to compress
 * @param options - Compression options
 * @returns Compressed file (or original if compression fails/unnecessary)
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Skip if not an image
    if (!file.type.startsWith('image/')) {
        return file
    }

    // Skip if already small enough
    const maxSizeBytes = (opts.maxSizeMB || 2) * 1024 * 1024
    if (file.size < maxSizeBytes) {
        console.log('[Compress] File already small enough, skipping compression')
        return file
    }

    try {
        return await compressWithCanvas(file, opts)
    } catch (error) {
        console.warn('[Compress] Compression failed, using original:', error)
        return file
    }
}

/**
 * Compress multiple images
 */
export async function compressImages(
    files: File[],
    options: CompressOptions = {}
): Promise<File[]> {
    return Promise.all(files.map(file => compressImage(file, options)))
}

/**
 * Compress using canvas (works in all browsers)
 */
async function compressWithCanvas(file: File, opts: CompressOptions): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
                try {
                    // Calculate new dimensions
                    let { width, height } = img
                    const maxW = opts.maxWidth || 1920
                    const maxH = opts.maxHeight || 1920

                    if (width > maxW || height > maxH) {
                        const ratio = Math.min(maxW / width, maxH / height)
                        width = Math.round(width * ratio)
                        height = Math.round(height * ratio)
                    }

                    // Create canvas
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height

                    const ctx = canvas.getContext('2d')
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'))
                        return
                    }

                    // Draw image
                    ctx.drawImage(img, 0, 0, width, height)

                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Canvas toBlob returned null'))
                                return
                            }

                            // Create new file with same name
                            const compressedFile = new File(
                                [blob],
                                file.name,
                                { type: 'image/jpeg', lastModified: Date.now() }
                            )

                            const savings = ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
                            console.log(`[Compress] ${file.name}: ${formatBytes(file.size)} → ${formatBytes(compressedFile.size)} (${savings}% smaller)`)

                            resolve(compressedFile)
                        },
                        'image/jpeg',
                        opts.quality || 0.8
                    )
                } catch (err) {
                    reject(err)
                }
            }

            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = e.target?.result as string
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * Get image dimensions without loading full image
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const img = new Image()

        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({ width: img.width, height: img.height })
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Failed to load image'))
        }

        img.src = url
    })
}

/**
 * Check if file is a valid image
 */
export function isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
    return validTypes.includes(file.type) || file.type.startsWith('image/')
}

/**
 * Generate thumbnail from image
 */
export async function generateThumbnail(
    file: File,
    maxSize: number = 200
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
                let { width, height } = img
                const ratio = Math.min(maxSize / width, maxSize / height)
                width = Math.round(width * ratio)
                height = Math.round(height * ratio)

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Could not get canvas context'))
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', 0.7))
            }

            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = e.target?.result as string
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}
