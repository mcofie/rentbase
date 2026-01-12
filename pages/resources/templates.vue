<template>
  <div class="max-w-6xl mx-auto px-6 py-24 animate-fade-in">
    <!-- Header -->
    <div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="h-16 w-16 bg-gradient-to-br from-[#E6F3FE] to-[#D3E5EF] rounded-xl flex items-center justify-center text-3xl mb-6">
          📄
        </div>
        <h1 class="text-4xl font-bold text-[#050505] dark:text-white tracking-tight font-serif mb-2">Contract Templates</h1>
        <p class="text-[#666666]">Legally-vetted documents for the Ghanaian real estate market.</p>
      </div>
      
      <div class="flex flex-wrap gap-2">
         <button 
           v-for="cat in categories" 
           :key="cat"
           @click="activeCategory = cat"
           :class="[
             'px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-colors',
             activeCategory === cat 
               ? 'bg-[#050505] text-white dark:bg-white dark:text-black' 
               : 'bg-[#F7F7F5] text-[#999999] hover:bg-[#E1E1E1] dark:bg-stone-800 dark:hover:bg-stone-700'
           ]"
         >
           {{ cat }}
         </button>
      </div>
    </div>
    
    <!-- Gallery Grid -->
    <div class="grid md:grid-cols-3 gap-6">
       <TransitionGroup name="list">
         <div v-for="template in filteredTemplates" :key="template.title" @click="downloadTemplate(template)" class="group flex flex-col bg-white dark:bg-stone-900 border border-[#E1E1E1] dark:border-stone-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
            <!-- Preview Area -->
            <div class="h-40 bg-[#F7F7F5] dark:bg-stone-900 border-b border-[#E1E1E1] dark:border-stone-800 flex items-center justify-center relative overflow-hidden">
               <div class="absolute inset-0 bg-white dark:bg-stone-900 opacity-50"></div>
               <UIcon :name="template.icon" class="w-12 h-12 text-[#999999] group-hover:scale-110 transition-transform duration-500 relative z-10" />
               <div class="absolute top-3 right-3 px-2 py-1 bg-white/80 dark:bg-black/50 backdrop-blur rounded text-[10px] font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700">
                 {{ template.tag }}
               </div>
            </div>
            
            <div class="p-5 flex-grow flex flex-col">
               <h3 class="font-bold text-lg text-[#050505] dark:text-white mb-2 group-hover:text-[#0075DE] transition-colors">{{ template.title }}</h3>
               <p class="text-sm text-[#666666] leading-relaxed mb-6 flex-grow">{{ template.description }}</p>
               
               <div class="pt-4 border-t border-[#F7F7F5] dark:border-stone-800 flex items-center justify-between text-xs">
                  <span class="text-[#999999]">Updated {{ template.updated }}</span>
                  <span class="font-bold text-[#0075DE] opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transform duration-300">Download PDF →</span>
               </div>
            </div>
         </div>
       </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

const toast = useToast()
const activeCategory = ref('All')
const categories = ['All', 'Residential', 'Business', 'Vacation', 'Financial', 'Operations']

const templates = [
  {
    title: 'Standard Tenancy Agreement',
    description: 'The standard residential lease for Ghana, compliant with Rent Act 220. Covers rent advance, responsibilities, and termination.',
    icon: 'i-lucide-file-text',
    tag: 'Residential',
    updated: '2 days ago',
    content: `TENANCY AGREEMENT\n\nTHIS AGREEMENT is made this [Date] day of [Month], [Year] BETWEEN [Name of Landlord] of [Address] (hereinafter called "the Landlord") of the one part AND [Name of Tenant] of [Address] (hereinafter called "the Tenant") of the other part.\n\n1. PREMISES\nThe Landlord hereby lets to the Tenant the property described as [Description of Property] specificially located at [Address of Property].\n\n2. TERM\nThe tenancy shall be for a period of [Duration] commencing on [Start Date] and ending on [End Date].\n\n3. RENT\nThe Tenant agrees to pay a rent of [Amount] per [Month/Year], payable in advance.\n\n4. TENANT'S OBLIGATIONS\nThe Tenant agrees:\na) To keep the interior of the premises in good and tenantable repair.\nb) Not to make any structural alterations without written consent.\nc) To pay all utility bills (electricity, water) consumed on the premises.\nd) Not to assign or sublet the premises without consent.\n\n5. LANDLORD'S OBLIGATIONS\nThe Landlord agrees:\na) To keep the structure and roof of the property in good repair.\nb) To allow the Tenant peaceful enjoyment of the premises.\n\nSIGNED by the Landlord: ___________________\nSIGNED by the Tenant: ___________________`
  },
  {
    title: 'Commercial Lease',
    description: 'For shops, offices, and retail spaces. Includes clauses for business operations, signage, and utilities.',
    icon: 'i-lucide-building-2',
    tag: 'Business',
    updated: '1 week ago',
    content: `COMMERCIAL LEASE AGREEMENT\n\nPARTIES:\nLandlord: [Name]\nTenant: [Business Name/Name]\n\nPROPERTY:\n[Address and Description of Commercial Space]\n\nUSE OF PREMISES:\nThe premises shall be used for the purpose of [Type of Business] only.\n\nTERMS:\n1. Lease Term: [Number] years\n2. Rent: [Amount] per annum\n3. Signage: Tenant may install signage with Landlord's approval.\n4. Business Hours: The Tenant may operate between [Start Time] and [End Time].\n\nMAINTENANCE:\nTenant is responsible for internal repairs and shop fittings.\n\nGOVERNING LAW:\nThis lease is governed by the laws of the Republic of Ghana.\n\nDate: [Date]\nSignatures: ___________________`
  },
  {
    title: 'Short-term Rental Agreement',
    description: 'Perfect for Airbnb-style stays or monthly rentals less than 6 months. Includes comprehensive guest rules.',
    icon: 'i-lucide-calendar-days',
    tag: 'Vacation',
    updated: 'Jan 2026',
    content: `SHORT-TERM RENTAL AGREEMENT\n\nGuest Name: [Name]\nProperty: [Address]\nCheck-in: [Date] | Check-out: [Date]\n\nHOUSE RULES:\n1. No smoking inside the property.\n2. No parties or events allowed.\n3. Quiet hours are from 10:00 PM to 7:00 AM.\n4. Maximum number of guests: [Number].\n\nPAYMENT:\nTotal Rental Fee: [Amount]\nSecurity Deposit: [Amount] (Refundable)\n\nCANCELLATION POLICY:\n[Policy Details]\n\nThe Guest agrees to abide by these rules and vacate the property by the check-out time.\n\nGuest Signature: ___________________\nHost Signature: ___________________`
  },
  {
    title: 'Deposit Receipt & Terms',
    description: 'Official acknowledgement of security deposit payment with clear conditions for refund.',
    icon: 'i-lucide-receipt',
    tag: 'Financial',
    updated: 'Dec 2025',
    content: `SECURITY DEPOSIT RECEIPT\n\nDate: [Date]\nReceived from: [Tenant Name]\nAmount: [Amount in Words] ([Amount in Figures])\nFor Property: [Address]\n\nTERMS OF REFUND:\nThis deposit is held as security for the performance of the Tenant's obligations. It will be refunded within [Number] days after vacating the premises, subject to deduction for:\n1. Unpaid rent\n2. Damage to property beyond normal wear and tear\n3. Unpaid utility bills\n\nLandlord/Agent Signature: ___________________`
  },
  {
    title: 'Property Handover Form',
    description: 'Document key handover and meter readings (ECG/Ghana Water) to avoid future disputes.',
    icon: 'i-lucide-key',
    tag: 'Operations',
    updated: 'Oct 2025',
    content: `PROPERTY HANDOVER FORM\n\nProperty: [Address]\nDate: [Date]\n\nKEYS HANDED OVER:\n[ ] Main Door [ ] Bedroom 1 [ ] Bedroom 2 [ ] Gate\nTotal Keys: [Number]\n\nMETER READINGS:\nElectricity (ECG) Meter #: [Number] | Reading: [Reading]\nWater (GWCL) Meter #: [Number] | Reading: [Reading]\n\nINVENTORY CHECKLIST (Brief):\n[ ] Living Room Lights working\n[ ] Taps flowing\n[ ] AC Remotes present\n\nReceived by (Tenant): ___________________\nHanded over by (Landlord/Agent): ___________________`
  }
]

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'All') return templates
  return templates.filter(t => t.tag === activeCategory.value)
})

function drawHeader(doc: any, pageNo: number) {
  const blueColor = '#0075DE'
  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header only on first page or simplified on others
  if (pageNo === 1) {
    doc.setFillColor(blueColor)
    doc.circle(margin + 5, 20, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('R', margin + 3.5, 21.5)
    
    doc.setFontSize(16)
    doc.setTextColor(blueColor)
    doc.text('RentBase', margin + 14, 22)
    doc.setDrawColor(225, 225, 225)
    doc.line(margin, 30, pageWidth - margin, 30)
  } else {
    // Watermark header for subsequent pages
    doc.setFontSize(10)
    doc.setTextColor(200, 200, 200)
    doc.text('RentBase Protocol', margin, 15)
  }
}

function drawFooter(doc: any, pageNo: number, pageCount: number) {
   const pageWidth = doc.internal.pageSize.getWidth()
   const pageHeight = doc.internal.pageSize.getHeight()
   
   doc.setFont('helvetica', 'normal')
   doc.setFontSize(8)
   doc.setTextColor(150, 150, 150)
   doc.text('Generated by RentBase Protocol • www.rentbase.app', pageWidth / 2, pageHeight - 15, { align: 'center' })
   
   doc.text(`${pageNo}`, pageWidth - 20, pageHeight - 15, { align: 'right' })
}

function downloadTemplate(template: any) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  
  // --- Setup Content ---
  const processedContent = template.content.replace(/\[(.*?)\]/g, '__________________________')
  
  doc.setFontSize(11)
  doc.setFont('times', 'normal')
  doc.setTextColor(0, 0, 0)
  
  // Split lines
  const lines = doc.splitTextToSize(processedContent, pageWidth - (margin * 2))
  
  let cursorY = 70 // Start after header
  let pageNo = 1
  
  // Draw Page 1 specifics (Title, Badge)
  drawHeader(doc, 1)
  
  doc.setFontSize(20)
  doc.setFont('times', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(template.title.toUpperCase(), margin, 50)
  
  doc.setFillColor(230, 243, 254)
  doc.roundedRect(pageWidth - margin - 50, 42, 50, 10, 2, 2, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#0075DE')
  doc.text('VERIFIED TEMPLATE', pageWidth - margin - 43, 48)
  
  // Reset for body
  doc.setFontSize(11)
  doc.setFont('times', 'normal')
  doc.setTextColor(0, 0, 0)
  
  // --- Loop Lines for Pagination ---
  for (let i = 0; i < lines.length; i++) {
    if (cursorY > pageHeight - 30) { // Bottom margin trigger
       drawFooter(doc, pageNo, 0) // Draw footer before leaving page
       doc.addPage()
       pageNo++
       cursorY = 30 // Top margin for new page
       drawHeader(doc, pageNo)
       
       // Reset font after header
       doc.setFontSize(11)
       doc.setFont('times', 'normal')
       doc.setTextColor(0, 0, 0)
    }
    doc.text(lines[i], margin, cursorY)
    cursorY += 7 // Line height
  }
  
  // --- Stamp (Only on last page) ---
  if (cursorY > pageHeight - 60) {
     drawFooter(doc, pageNo, 0)
     doc.addPage()
     pageNo++
     cursorY = 30
     drawHeader(doc, pageNo)
  }
  
  const stampX = pageWidth - 40
  const stampY = pageHeight - 50
  
  // Outer Circle
  doc.setDrawColor('#0075DE')
  doc.setLineWidth(0.5)
  doc.circle(stampX, stampY, 15, 'S')
  
  // Inner Text
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#0075DE')
  doc.text('RENTBASE', stampX, stampY - 6, { align: 'center' })
  doc.text('OFFICIAL', stampX, stampY, { align: 'center' })
  doc.text('PROTOCOL', stampX, stampY + 6, { align: 'center' })
  
  drawFooter(doc, pageNo, 0)

  doc.save(`${template.title.replace(/\s+/g, '_')}.pdf`)
  toast.add({ title: 'Template Downloaded', description: `${template.title} saved with fillable spaces.`, color: 'success' })
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
