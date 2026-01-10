import { jsPDF } from 'jspdf'
import type { ConditionReport, ReportImage } from '~/types'

/**
 * Generate a condition report PDF with images
 * @param report - The condition report details
 * @param images - Array of report images
 * @param isDraft - Whether this is a draft (adds watermark)
 * @returns The generated PDF document
 */
export async function generateConditionReportPDF(
    report: ConditionReport,
    images: ReportImage[],
    isDraft: boolean = true
): Promise<jsPDF> {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = 20

    // Add draft watermark if not finalized
    if (isDraft) {
        doc.setTextColor(220, 220, 220)
        doc.setFontSize(60)
        doc.text('DRAFT', pageWidth / 2, 150, {
            align: 'center',
            angle: 45,
        })
        doc.setTextColor(0, 0, 0)
    }

    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('PROPERTY CONDITION REPORT', pageWidth / 2, yPos, { align: 'center' })
    yPos += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const reportTypeText = report.report_type === 'move_out' ? 'Move-Out Inspection' : 'Move-In Snapshot'
    doc.text(`Deposit Shield - ${reportTypeText}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Report Details Box
    doc.setFillColor(245, 245, 245)
    doc.rect(margin, yPos - 5, pageWidth - margin * 2, report.property_address ? 40 : 30, 'F')

    doc.setFontSize(10)
    doc.text(`Report ID: ${report.id}`, margin + 5, yPos + 2)
    doc.text(`Date: ${new Date(report.report_date).toLocaleDateString('en-GB')} at ${new Date(report.report_date).toLocaleTimeString('en-GB')}`, margin + 5, yPos + 10)
    doc.text(`Status: ${report.is_finalized ? 'FINALIZED ✓' : 'DRAFT'}`, margin + 5, yPos + 18)

    if (report.property_address) {
        doc.setFont('helvetica', 'bold')
        doc.text(`Property: ${report.property_address}`, margin + 5, yPos + 28)
        doc.setFont('helvetica', 'normal')
        yPos += 45
    } else {
        yPos += 35
    }

    yPos += 5

    // Data Retention Notice
    doc.setFillColor(240, 253, 244) // Light green
    doc.rect(margin, yPos, pageWidth - margin * 2, 18, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(22, 163, 74) // Green text
    doc.text('DATA RETENTION: This report and all photos are securely stored for 2 YEARS.', margin + 5, yPos + 7)
    doc.setFont('helvetica', 'normal')
    doc.text('Retrieve anytime using your Report ID and registered email.', margin + 5, yPos + 13)
    doc.setTextColor(0, 0, 0)
    yPos += 25

    // Divider
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 15

    // Images Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('DOCUMENTED DEFECTS AND CONDITIONS', margin, yPos)
    yPos += 15

    if (images.length === 0) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.text('No images documented.', margin, yPos)
    } else {
        // Process each image
        for (let i = 0; i < images.length; i++) {
            const image = images[i]

            // Check if we need a new page
            if (yPos > pageHeight - 100) {
                doc.addPage()
                yPos = 20

                // Add watermark to new page if draft
                if (isDraft) {
                    doc.setTextColor(220, 220, 220)
                    doc.setFontSize(60)
                    doc.text('DRAFT', pageWidth / 2, 150, {
                        align: 'center',
                        angle: 45,
                    })
                    doc.setTextColor(0, 0, 0)
                }
            }

            // Image number
            doc.setFontSize(11)
            doc.setFont('helvetica', 'bold')
            doc.text(`Photo ${i + 1} of ${images.length}`, margin, yPos)
            yPos += 8

            // Try to load and add the image
            try {
                const imgData = await loadImageAsBase64(image.image_url)
                if (imgData) {
                    // Add image (max width 100, maintain aspect ratio)
                    const imgWidth = 100
                    const imgHeight = 75 // Approximate, could calculate actual ratio
                    doc.addImage(imgData, 'JPEG', margin, yPos, imgWidth, imgHeight)
                    yPos += imgHeight + 5
                }
            } catch (error) {
                doc.setFontSize(9)
                doc.setFont('helvetica', 'italic')
                doc.text('[Image could not be loaded]', margin, yPos)
                yPos += 10
            }

            // Description
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            if (image.defect_description) {
                const descLines = doc.splitTextToSize(`Description: ${image.defect_description}`, pageWidth - margin * 2)
                doc.text(descLines, margin, yPos)
                yPos += descLines.length * 5
            } else {
                doc.text('Description: No description provided', margin, yPos)
            }
            yPos += 15
        }
    }

    // Add timestamp footer on last page
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
        `This report was generated on ${new Date().toISOString()} and serves as a timestamped record of the property condition.`,
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center', maxWidth: pageWidth - margin * 2 }
    )
    doc.text('Generated by RentBase - Deposit Shield', pageWidth / 2, pageHeight - 8, { align: 'center' })

    return doc
}

/**
 * Load an image URL as base64
 * @param url - The image URL
 * @returns Base64 encoded image data
 */
async function loadImageAsBase64(url: string): Promise<string | null> {
    try {
        const response = await fetch(url)
        const blob = await response.blob()

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error('Failed to load image:', error)
        return null
    }
}

/**
 * Download the condition report PDF
 * @param report - The condition report
 * @param images - Array of report images
 * @param isDraft - Whether this is a draft
 */
export async function downloadConditionReportPDF(
    report: ConditionReport,
    images: ReportImage[],
    isDraft: boolean = true
): Promise<void> {
    const doc = await generateConditionReportPDF(report, images, isDraft)
    const filename = isDraft
        ? `RentBase_ConditionReport_Draft_${Date.now()}.pdf`
        : `RentBase_ConditionReport_${Date.now()}.pdf`
    doc.save(filename)
}
