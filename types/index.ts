// ============================================
// Profile Types
// ============================================
export type UserRole = 'renter' | 'agent' | 'admin'

export interface Profile {
    id: string
    phone_number: string
    role: UserRole
    is_verified: boolean
    created_at: string
}

// ============================================
// Review Types
// ============================================
export interface Review {
    id: number
    agent_phone: string
    reviewer_id: string
    rating: number
    comment: string | null
    created_at: string
}

export interface AgentReviewSummary {
    agent_phone: string
    total_reviews: number
    average_rating: number
    trust_level: 'red' | 'yellow' | 'green'
}

// ============================================
// Transaction Types
// ============================================
export type TransactionStatus = 'pending' | 'success' | 'failed'
export type FeatureType = 'contract' | 'deposit_report'

export interface Transaction {
    id: string
    user_id: string
    reference: string
    amount: number
    status: TransactionStatus
    feature_type: FeatureType
    created_at: string
}

// ============================================
// Contract Types (Pocket Lawyer)
// ============================================
export interface ContractDetails {
    // Landlord Information
    landlord_name: string
    landlord_phone: string
    landlord_id_type: string
    landlord_id_number: string

    // Tenant Information
    tenant_name: string
    tenant_phone: string
    tenant_email?: string // Optional - for email notifications
    tenant_id_type: string
    tenant_id_number: string

    // Property Information
    property_address: string
    property_type: string
    property_description: string

    // Rental Terms
    rent_amount: number
    rent_currency: string
    payment_frequency: 'monthly' | 'quarterly' | 'yearly'
    security_deposit: number
    lease_start_date: string
    lease_duration_months: number

    // Additional Terms
    utilities_included: string[]
    special_terms: string
}

export interface Contract {
    id: string
    user_id: string | null
    customer_email: string | null
    payment_ref: string | null
    details: ContractDetails
    is_finalized: boolean

    // Digital Signature Fields
    landlord_signature: string | null
    landlord_signed_at: string | null
    landlord_sign_token: string
    landlord_short_code?: string // Short code for SMS (8 chars)
    tenant_signature: string | null
    tenant_signed_at: string | null
    tenant_sign_token: string
    tenant_short_code?: string // Short code for SMS (8 chars)
    is_fully_signed: boolean

    created_at: string
}

// ============================================
// Condition Report Types (Deposit Shield)
// ============================================
export interface ReportImage {
    id: number
    report_id: string
    image_url: string
    room_name: string | null
    defect_description: string | null
}

export interface ConditionReport {
    id: string
    user_id: string | null
    customer_email: string | null
    payment_ref: string | null
    property_address: string | null
    report_type: 'move_in' | 'move_out' | null
    is_finalized: boolean
    report_date: string
    images?: ReportImage[]
}

// ============================================
// Paystack Types
// ============================================
export interface PaystackConfig {
    key: string
    email: string
    amount: number // In pesewas
    currency: string
    ref: string
    callback: (response: PaystackResponse) => void
    onClose: () => void
}

export interface PaystackResponse {
    reference: string
    status: string
    trans: string
    transaction: string
    message: string
}

// ============================================
// Pricing Constants
// ============================================
export const PRICING = {
    CONTRACT: {
        amount: 1, // GH₵ - TEST PRICE
        pesewas: 100,
        label: 'Pocket Lawyer - Tenancy Agreement',
    },
    DEPOSIT_REPORT: {
        amount: 1, // GH₵ - TEST PRICE
        pesewas: 100,
        label: 'Deposit Shield - Condition Report',
    },
} as const

// ============================================
// Form Validation Types
// ============================================
export interface AuthFormState {
    phone: string
    otp: string
    step: 'phone' | 'otp'
    loading: boolean
    error: string | null
}

export interface ContractFormState extends ContractDetails {
    loading: boolean
    error: string | null
}
