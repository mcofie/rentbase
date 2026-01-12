// Lazy load jsPDF to reduce initial bundle size
// jsPDF is ~500KB, so we only load it when actually generating a PDF
import type { jsPDF as JsPDFType } from 'jspdf'
import type { ContractDetails } from '~/types'

// Cached module reference
let jsPDFModule: typeof import('jspdf') | null = null

/**
 * Lazy load jsPDF module
 */
async function getJsPDF(): Promise<typeof JsPDFType> {
    if (!jsPDFModule) {
        jsPDFModule = await import('jspdf')
    }
    return jsPDFModule.jsPDF
}
/**
 * Convert number to words for legal documents
 */
function numberToWords(num: number): string {
    if (num === 0) return 'zero'

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
        'seventeen', 'eighteen', 'nineteen']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    const scales = ['', 'thousand', 'million', 'billion']

    function convertHundreds(n: number): string {
        let str = ''
        if (n >= 100) {
            str += ones[Math.floor(n / 100)] + ' hundred '
            n %= 100
        }
        if (n >= 20) {
            str += tens[Math.floor(n / 10)] + ' '
            n %= 10
        }
        if (n > 0) {
            str += ones[n] + ' '
        }
        return str.trim()
    }

    if (num < 0) return 'negative ' + numberToWords(-num)
    if (num < 1000) return convertHundreds(num)

    let result = ''
    let scaleIndex = 0

    while (num > 0) {
        const chunk = num % 1000
        if (chunk > 0) {
            const chunkWords = convertHundreds(chunk)
            result = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + result
        }
        num = Math.floor(num / 1000)
        scaleIndex++
    }

    return result.trim()
}

/**
 * Get ordinal suffix for a number
 */
function getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Format date in legal style
 */
function formatDateLegal(dateString: string): string {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-GB', { month: 'long' })
    const year = date.getFullYear()
    return `${getOrdinal(day)} day of ${month}, ${year}`
}

/**
 * Calculate end date
 */
function calculateEndDate(startDate: string, months: number): string {
    if (!startDate) return ''
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + months)
    return date.toISOString()
}

/**
 * Get payment period text
 */
function getPaymentPeriod(frequency: string): string {
    switch (frequency) {
        case 'monthly': return 'month'
        case 'quarterly': return 'quarter'
        case 'yearly': return 'year'
        default: return 'period'
    }
}

/**
 * Generate a tenancy agreement PDF with full legal clauses
 * @param contract - The contract details
 * @param isDraft - Whether this is a draft (adds watermark)
 * @param landlordSignature - Base64 encoded landlord signature image
 * @param tenantSignature - Base64 encoded tenant signature image
 * @returns The generated PDF document
 */
export async function generateContractPDF(
    contract: ContractDetails,
    isDraft: boolean = true,
    landlordSignature?: string | null,
    tenantSignature?: string | null
): Promise<InstanceType<typeof JsPDFType>> {
    const jsPDF = await getJsPDF()
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - margin * 2
    let yPos = 25

    // Line height constants
    const LINE_HEIGHT = 6
    const PARAGRAPH_SPACING = 10
    const SECTION_SPACING = 15

    // Helper to check page break
    function checkPageBreak(neededSpace: number = 40) {
        if (yPos > pageHeight - neededSpace) {
            doc.addPage()
            yPos = 25
            if (isDraft) addWatermark()
        }
    }

    // Add draft watermark
    function addWatermark() {
        if (isDraft) {
            doc.saveGraphicsState()
            doc.setTextColor(230, 230, 230)
            doc.setFontSize(50)
            doc.text('DRAFT', pageWidth / 2, pageHeight / 2, {
                align: 'center',
                angle: 45,
            })
            doc.restoreGraphicsState()
            doc.setTextColor(0, 0, 0)
        }
    }

    // Helper to write wrapped text and return new Y position
    function writeText(text: string, x: number, fontSize: number = 10, fontStyle: 'normal' | 'bold' = 'normal'): number {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', fontStyle)
        const lines = doc.splitTextToSize(text, contentWidth - (x - margin))

        lines.forEach((line: string, index: number) => {
            checkPageBreak(20)
            doc.text(line, x, yPos)
            if (index < lines.length - 1) {
                yPos += LINE_HEIGHT
            }
        })

        return yPos
    }

    // Helper for section headers
    function writeSectionHeader(text: string) {
        checkPageBreak(30)
        yPos += SECTION_SPACING
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(text, margin, yPos)
        yPos += PARAGRAPH_SPACING
    }

    // Helper for clause headers
    function writeClauseHeader(text: string) {
        checkPageBreak(25)
        yPos += PARAGRAPH_SPACING
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(text, margin, yPos)
        yPos += LINE_HEIGHT + 2
    }

    addWatermark()

    // ========== HEADER ==========
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text('RentBase Protocol', margin, yPos)
    if (isDraft) {
        doc.text('UNPAID DRAFT - NOT VALID', pageWidth - margin, yPos, { align: 'right' })
    }
    doc.setTextColor(0, 0, 0)
    yPos += 12

    // Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RESIDENTIAL TENANCY AGREEMENT', pageWidth / 2, yPos, { align: 'center' })
    yPos += 7

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text('Made pursuant to the Rent Act, 1963 (Act 220) of Ghana', pageWidth / 2, yPos, { align: 'center' })
    doc.setTextColor(0, 0, 0)
    yPos += 10

    // Divider
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += SECTION_SPACING

    // ========== PREAMBLE ==========
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const preamble = `THIS TENANCY AGREEMENT is made on this ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
    writeText(preamble, margin)
    yPos += SECTION_SPACING

    // ========== PARTIES ==========
    writeSectionHeader('BETWEEN')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const landlordText = `${contract.landlord_name.toUpperCase()}, holder of ${contract.landlord_id_type} No. ${contract.landlord_id_number}, contactable at ${contract.landlord_phone} (hereinafter referred to as "THE LANDLORD", which expression shall where the context so admits, include his/her heirs, executors, administrators and assigns)`
    writeText(landlordText, margin)
    yPos += PARAGRAPH_SPACING

    doc.setFont('helvetica', 'bold')
    doc.text('AND', pageWidth / 2, yPos, { align: 'center' })
    yPos += PARAGRAPH_SPACING

    doc.setFont('helvetica', 'normal')
    const tenantText = `${contract.tenant_name.toUpperCase()}, holder of ${contract.tenant_id_type} No. ${contract.tenant_id_number}, contactable at ${contract.tenant_phone} (hereinafter referred to as "THE TENANT", which expression shall where the context so admits, include his/her heirs, executors, administrators and assigns)`
    writeText(tenantText, margin)
    yPos += SECTION_SPACING

    // ========== RECITALS ==========
    writeSectionHeader('WHEREAS')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const recitals = [
        '(a) The Landlord is the owner and/or has the right to let the property described herein.',
        '(b) The Tenant desires to rent the said property as a residential dwelling.',
        '(c) Both parties have agreed to enter into this tenancy agreement on the terms and conditions set out below.'
    ]

    recitals.forEach(r => {
        writeText(r, margin + 5)
        yPos += LINE_HEIGHT + 2
    })
    yPos += PARAGRAPH_SPACING

    // ========== OPERATIVE PART ==========
    writeSectionHeader('NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:')

    // ========== CLAUSE 1: THE PREMISES ==========
    writeClauseHeader('1. THE PREMISES')

    doc.setFont('helvetica', 'normal')
    writeText('The Landlord hereby lets and the Tenant hereby takes as tenant the property known and described as:', margin)
    yPos += LINE_HEIGHT + 2

    // Property box
    doc.setFillColor(245, 245, 245)
    doc.rect(margin, yPos - 3, contentWidth, 18, 'F')
    yPos += 4
    doc.setFont('helvetica', 'bold')
    doc.text(contract.property_address, margin + 5, yPos)
    yPos += LINE_HEIGHT
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Property Type: ${contract.property_type}`, margin + 5, yPos)
    yPos += 12

    doc.setFontSize(10)
    writeText('(hereinafter referred to as "THE PREMISES")', margin)
    yPos += SECTION_SPACING

    // ========== CLAUSE 2: TERM ==========
    writeClauseHeader('2. TERM OF TENANCY')

    doc.setFont('helvetica', 'normal')
    const endDate = calculateEndDate(contract.lease_start_date, contract.lease_duration_months)
    const termText = `The tenancy shall be for a period of ${contract.lease_duration_months} (${numberToWords(contract.lease_duration_months)}) months, commencing on ${formatDateLegal(contract.lease_start_date)} and expiring on ${formatDateLegal(endDate)}, unless terminated earlier or renewed in accordance with the terms of this Agreement.`
    writeText(termText, margin)
    yPos += SECTION_SPACING

    // ========== CLAUSE 3: RENT ==========
    writeClauseHeader('3. RENT')

    doc.setFont('helvetica', 'normal')

    const rent3_1 = `3.1 The Tenant shall pay to the Landlord a rent of ${contract.rent_currency} ${contract.rent_amount.toLocaleString()} (${contract.rent_currency} ${numberToWords(contract.rent_amount)}) payable ${contract.payment_frequency}.`
    writeText(rent3_1, margin)
    yPos += LINE_HEIGHT + 3

    const rent3_2 = `3.2 Rent shall be paid in advance on or before the ${getOrdinal(1)} day of each ${getPaymentPeriod(contract.payment_frequency)}.`
    writeText(rent3_2, margin)
    yPos += LINE_HEIGHT + 3

    const rent3_3 = '3.3 All payments shall be made via mobile money, bank transfer, or any other method mutually agreed upon by both parties.'
    writeText(rent3_3, margin)
    yPos += SECTION_SPACING

    // ========== CLAUSE 4: SECURITY DEPOSIT ==========
    writeClauseHeader('4. SECURITY DEPOSIT')

    doc.setFont('helvetica', 'normal')

    const deposit4_1 = `4.1 The Tenant shall pay a security deposit of ${contract.rent_currency} ${contract.security_deposit.toLocaleString()} (${contract.rent_currency} ${numberToWords(contract.security_deposit)}) upon execution of this Agreement.`
    writeText(deposit4_1, margin)
    yPos += LINE_HEIGHT + 3

    const deposit4_2 = '4.2 The security deposit shall be refunded to the Tenant within thirty (30) days of the termination of this Agreement, subject to deductions for any unpaid rent, damages to the Premises beyond normal wear and tear, or other charges owed by the Tenant.'
    writeText(deposit4_2, margin)
    yPos += SECTION_SPACING

    // ========== CLAUSE 5: UTILITIES (if any) ==========
    let clauseNum = 5
    if (contract.utilities_included && contract.utilities_included.length > 0) {
        writeClauseHeader(`${clauseNum}. UTILITIES AND SERVICES`)

        doc.setFont('helvetica', 'normal')
        writeText(`${clauseNum}.1 The following utilities and services are INCLUDED in the rent:`, margin)
        yPos += LINE_HEIGHT + 2

        doc.setFont('helvetica', 'bold')
        writeText(contract.utilities_included.join(', '), margin + 10)
        yPos += LINE_HEIGHT + 3

        doc.setFont('helvetica', 'normal')
        writeText(`${clauseNum}.2 All other utilities not listed above shall be the responsibility of the Tenant.`, margin)
        yPos += SECTION_SPACING
        clauseNum++
    }

    // ========== CLAUSE: TENANT'S OBLIGATIONS ==========
    writeClauseHeader(`${clauseNum}. TENANT'S OBLIGATIONS`)

    doc.setFont('helvetica', 'normal')
    writeText('The Tenant hereby covenants and agrees:', margin)
    yPos += LINE_HEIGHT + 2

    const obligations = [
        '(a) To pay rent promptly on the due date;',
        '(b) To keep the Premises in good and clean condition;',
        '(c) To use the Premises only for residential purposes;',
        '(d) Not to assign, sublet, or part with possession of the Premises without prior written consent of the Landlord;',
        '(e) Not to make any structural alterations to the Premises without the Landlord\'s written consent;',
        '(f) To permit the Landlord or authorized agents to enter the Premises for inspection with reasonable notice;',
        '(g) To comply with all applicable laws, regulations, and rules of the building or community.'
    ]

    obligations.forEach(o => {
        checkPageBreak(20)
        writeText(o, margin + 5)
        yPos += LINE_HEIGHT + 2
    })
    yPos += PARAGRAPH_SPACING

    // ========== SPECIAL TERMS ==========
    if (contract.special_terms) {
        writeClauseHeader('SPECIAL TERMS AND CONDITIONS')

        doc.setFont('helvetica', 'normal')
        writeText(contract.special_terms, margin)
        yPos += SECTION_SPACING
    }

    // ========== GOVERNING LAW ==========
    writeClauseHeader('GOVERNING LAW')

    doc.setFont('helvetica', 'normal')
    const govLaw = 'This Agreement shall be governed by and construed in accordance with the laws of the Republic of Ghana, particularly the Rent Act, 1963 (Act 220) and any amendments thereto.'
    writeText(govLaw, margin)
    yPos += SECTION_SPACING

    // ========== EXECUTION ==========
    checkPageBreak(100)
    writeSectionHeader('IN WITNESS WHEREOF')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    writeText('The parties hereto have executed this Agreement on the day and year first above written.', margin)
    yPos += SECTION_SPACING + 10

    // ========== SIGNATURE BLOCKS ==========
    const sigWidth = 70
    const sigHeight = 25

    // Landlord signature
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('THE LANDLORD', margin, yPos)
    yPos += 8

    // Add digital signature if available
    if (landlordSignature) {
        try {
            doc.addImage(landlordSignature, 'PNG', margin, yPos, sigWidth, sigHeight)
            yPos += sigHeight + 2
            doc.setFontSize(8)
            doc.setTextColor(34, 197, 94) // Green color
            doc.text('✓ Digitally Signed', margin, yPos)
            doc.setTextColor(0, 0, 0)
        } catch (e) {
            console.warn('Failed to add landlord signature:', e)
            yPos += 15
            doc.setLineWidth(0.5)
            doc.line(margin, yPos, margin + sigWidth, yPos)
        }
    } else {
        yPos += 15
        doc.setLineWidth(0.5)
        doc.line(margin, yPos, margin + sigWidth, yPos)
    }
    yPos += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Signature', margin, yPos)
    doc.text('Date: _________________', margin + sigWidth + 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.text(`Name: ${contract.landlord_name}`, margin, yPos)
    yPos += 25

    // Tenant signature
    checkPageBreak(60)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('THE TENANT', margin, yPos)
    yPos += 8

    // Add digital signature if available
    if (tenantSignature) {
        try {
            doc.addImage(tenantSignature, 'PNG', margin, yPos, sigWidth, sigHeight)
            yPos += sigHeight + 2
            doc.setFontSize(8)
            doc.setTextColor(34, 197, 94) // Green color
            doc.text('✓ Digitally Signed', margin, yPos)
            doc.setTextColor(0, 0, 0)
        } catch (e) {
            console.warn('Failed to add tenant signature:', e)
            yPos += 15
            doc.line(margin, yPos, margin + sigWidth, yPos)
        }
    } else {
        yPos += 15
        doc.line(margin, yPos, margin + sigWidth, yPos)
    }
    yPos += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Signature', margin, yPos)
    doc.text('Date: _________________', margin + sigWidth + 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.text(`Name: ${contract.tenant_name}`, margin, yPos)
    yPos += 25

    // ========== WITNESS SECTION ==========
    checkPageBreak(40)
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('WITNESSES (Optional)', margin, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 12

    doc.text('Witness for Landlord: _________________________________  Date: _____________', margin, yPos)
    yPos += 12
    doc.text('Witness for Tenant:   _________________________________  Date: _____________', margin, yPos)

    // ========== FOOTER ON ALL PAGES ==========
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text('Generated by RentBase Protocol - The Carfax for Rentals in Africa | www.rentbase.app', pageWidth / 2, pageHeight - 10, { align: 'center' })
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
    }

    return doc
}

/**
 * Download the contract PDF
 * @param contract - The contract details
 * @param isDraft - Whether this is a draft
 * @param landlordSignature - Optional landlord signature
 * @param tenantSignature - Optional tenant signature
 */
export async function downloadContractPDF(
    contract: ContractDetails,
    isDraft: boolean = true,
    landlordSignature?: string | null,
    tenantSignature?: string | null
): Promise<void> {
    const doc = await generateContractPDF(contract, isDraft, landlordSignature, tenantSignature)
    const filename = isDraft
        ? `RentBase_Draft_${Date.now()}.pdf`
        : `RentBase_Agreement_${contract.landlord_name}_${contract.tenant_name}.pdf`
    doc.save(filename)
}
