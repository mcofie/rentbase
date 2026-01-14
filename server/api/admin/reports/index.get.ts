import { createSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const client = createSupabaseServer()

    try {
        // Fetch reports
        const { data: reports, error } = await client
            .from('condition_reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (error) throw error

        if (!reports || reports.length === 0) {
            return []
        }

        const reportIds = reports.map(r => r.id)

        // Fetch images for these reports
        const { data: images } = await client
            .from('report_images')
            .select('report_id, image_url')
            .in('report_id', reportIds)

        // Combine data
        const result = reports.map(report => {
            const reportImages = images?.filter(img => img.report_id === report.id) || []
            return {
                ...report,
                photo_count: reportImages.length,
                thumbnail: reportImages[0]?.image_url || null
            }
        })

        return result

    } catch (err: any) {
        throw createError({
            statusCode: 500,
            message: err.message || 'Failed to fetch reports'
        })
    }
})
