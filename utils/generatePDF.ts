import { jsPDF } from 'jspdf'
import type { ContractDetails } from '~/types'

/**
 * Generate a tenancy agreement PDF
 * @param contract - The contract details
 * @param isDraft - Whether this is a draft (adds watermark)
 * @returns The generated PDF document
 */
export function generateContractPDF(
    contract: ContractDetails,
    isDraft: boolean = true
): jsPDF {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20

    // Add draft watermark if not finalized
    if (isDraft) {
        doc.setTextColor(220, 220, 220)
        doc.setFontSize(60)
        doc.text('DRAFT - NOT VALID', pageWidth / 2, 150, {
            align: 'center',
            angle: 45,
        })
        doc.setTextColor(0, 0, 0)
    }

    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('TENANCY AGREEMENT', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20

    // Section: Parties
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PARTIES TO THIS AGREEMENT', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // Landlord Details
    doc.text('LANDLORD:', margin, yPos)
    yPos += 6
    doc.text(`Name: ${contract.landlord_name}`, margin + 10, yPos)
    yPos += 5
    doc.text(`Phone: ${contract.landlord_phone}`, margin + 10, yPos)
    yPos += 5
    doc.text(`ID (${contract.landlord_id_type}): ${contract.landlord_id_number}`, margin + 10, yPos)
    yPos += 12

    // Tenant Details
    doc.text('TENANT:', margin, yPos)
    yPos += 6
    doc.text(`Name: ${contract.tenant_name}`, margin + 10, yPos)
    yPos += 5
    doc.text(`Phone: ${contract.tenant_phone}`, margin + 10, yPos)
    yPos += 5
    doc.text(`ID (${contract.tenant_id_type}): ${contract.tenant_id_number}`, margin + 10, yPos)
    yPos += 15

    // Section: Property
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PROPERTY DETAILS', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Address: ${contract.property_address}`, margin, yPos)
    yPos += 6
    doc.text(`Type: ${contract.property_type}`, margin, yPos)
    yPos += 6

    // Handle long descriptions with text wrapping
    const descLines = doc.splitTextToSize(`Description: ${contract.property_description}`, pageWidth - margin * 2)
    doc.text(descLines, margin, yPos)
    yPos += descLines.length * 5 + 10

    // Section: Rental Terms
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('RENTAL TERMS', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Rent Amount: ${contract.rent_currency} ${contract.rent_amount.toLocaleString()}`, margin, yPos)
    yPos += 6
    doc.text(`Payment Frequency: ${contract.payment_frequency.charAt(0).toUpperCase() + contract.payment_frequency.slice(1)}`, margin, yPos)
    yPos += 6
    doc.text(`Security Deposit: ${contract.rent_currency} ${contract.security_deposit.toLocaleString()}`, margin, yPos)
    yPos += 6
    doc.text(`Lease Start Date: ${new Date(contract.lease_start_date).toLocaleDateString('en-GB')}`, margin, yPos)
    yPos += 6
    doc.text(`Lease Duration: ${contract.lease_duration_months} months`, margin, yPos)
    yPos += 15

    // Section: Utilities
    if (contract.utilities_included.length > 0) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('UTILITIES INCLUDED', margin, yPos)
        yPos += 10

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(contract.utilities_included.join(', '), margin, yPos)
        yPos += 15
    }

    // Section: Special Terms
    if (contract.special_terms) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('SPECIAL TERMS AND CONDITIONS', margin, yPos)
        yPos += 10

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const termLines = doc.splitTextToSize(contract.special_terms, pageWidth - margin * 2)
        doc.text(termLines, margin, yPos)
        yPos += termLines.length * 5 + 15
    }

    // Check if we need a new page for signatures
    if (yPos > 230) {
        doc.addPage()
        yPos = 20
    }

    // Section: Signatures
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SIGNATURES', margin, yPos)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // Landlord signature
    doc.text('LANDLORD:', margin, yPos)
    yPos += 15
    doc.line(margin, yPos, margin + 60, yPos)
    doc.text('Signature', margin, yPos + 5)
    doc.line(margin + 80, yPos, margin + 140, yPos)
    doc.text('Date', margin + 80, yPos + 5)
    yPos += 20

    // Tenant signature
    doc.text('TENANT:', margin, yPos)
    yPos += 15
    doc.line(margin, yPos, margin + 60, yPos)
    doc.text('Signature', margin, yPos + 5)
    doc.line(margin + 80, yPos, margin + 140, yPos)
    doc.text('Date', margin + 80, yPos + 5)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Generated by RentBase - The Carfax for Rentals in Africa', pageWidth / 2, 285, { align: 'center' })
    doc.text('www.rentbase.app', pageWidth / 2, 290, { align: 'center' })

    return doc
}

/**
 * Download the contract PDF
 * @param contract - The contract details
 * @param isDraft - Whether this is a draft
 * @param filename - Optional custom filename
 */
export function downloadContractPDF(
    contract: ContractDetails,
    isDraft: boolean = true,
    filename?: string
): void {
    const doc = generateContractPDF(contract, isDraft)
    const defaultFilename = isDraft
        ? `RentBase_Draft_${Date.now()}.pdf`
        : `RentBase_Agreement_${Date.now()}.pdf`
    doc.save(filename || defaultFilename)
}
