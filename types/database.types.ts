// Database types for Supabase
// This file can be regenerated using: npx supabase gen types typescript --local > types/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    phone_number: string
                    role: 'renter' | 'agent' | 'admin'
                    is_verified: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    phone_number: string
                    role?: 'renter' | 'agent' | 'admin'
                    is_verified?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    phone_number?: string
                    role?: 'renter' | 'agent' | 'admin'
                    is_verified?: boolean
                    created_at?: string
                }
            }
            reviews: {
                Row: {
                    id: number
                    agent_phone: string
                    reviewer_id: string | null
                    rating: number
                    comment: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    agent_phone: string
                    reviewer_id?: string | null
                    rating: number
                    comment?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    agent_phone?: string
                    reviewer_id?: string | null
                    rating?: number
                    comment?: string | null
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string | null
                    reference: string
                    amount: number
                    status: 'pending' | 'success' | 'failed'
                    feature_type: 'contract' | 'deposit_report'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    reference: string
                    amount: number
                    status?: 'pending' | 'success' | 'failed'
                    feature_type: 'contract' | 'deposit_report'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    reference?: string
                    amount?: number
                    status?: 'pending' | 'success' | 'failed'
                    feature_type?: 'contract' | 'deposit_report'
                    created_at?: string
                }
            }
            contracts: {
                Row: {
                    id: string
                    user_id: string | null
                    payment_ref: string | null
                    details: Json
                    is_finalized: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    payment_ref?: string | null
                    details?: Json
                    is_finalized?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    payment_ref?: string | null
                    details?: Json
                    is_finalized?: boolean
                    created_at?: string
                }
            }
            condition_reports: {
                Row: {
                    id: string
                    user_id: string | null
                    payment_ref: string | null
                    is_finalized: boolean
                    report_date: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    payment_ref?: string | null
                    is_finalized?: boolean
                    report_date?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    payment_ref?: string | null
                    is_finalized?: boolean
                    report_date?: string
                }
            }
            report_images: {
                Row: {
                    id: number
                    report_id: string | null
                    image_url: string
                    defect_description: string | null
                }
                Insert: {
                    id?: number
                    report_id?: string | null
                    image_url: string
                    defect_description?: string | null
                }
                Update: {
                    id?: number
                    report_id?: string | null
                    image_url?: string
                    defect_description?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
