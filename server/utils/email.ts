/**
 * Email Notification Utility
 * 
 * Uses Supabase Edge Functions or external email service (Resend, SendGrid, etc.)
 * This is a template that can be configured with your preferred email provider.
 */

interface EmailOptions {
    to: string
    subject: string
    html: string
    text?: string
}

interface EmailResult {
    success: boolean
    error?: string
    messageId?: string
}

/**
 * Send email notification using configured provider
 * Configure RESEND_API_KEY or SENDGRID_API_KEY in environment
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
    const config = useRuntimeConfig()

    // Try Resend first (recommended for Nuxt)
    if (config.resendApiKey) {
        return sendWithResend(options, config.resendApiKey)
    }

    // Fallback to SendGrid
    if (config.sendgridApiKey) {
        return sendWithSendGrid(options, config.sendgridApiKey)
    }

    // No email provider configured - log and return success (silent fail in dev)
    console.warn('[Email] No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY.')
    return { success: true, messageId: 'dev-mode-no-email-sent' }
}

async function sendWithResend(options: EmailOptions, apiKey: string): Promise<EmailResult> {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'RentBase <noreply@rentbase.app>',
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            return { success: true, messageId: data.id }
        }

        return { success: false, error: data.message || 'Failed to send email' }
    } catch (error: any) {
        console.error('[Email] Resend error:', error)
        return { success: false, error: error.message }
    }
}

async function sendWithSendGrid(options: EmailOptions, apiKey: string): Promise<EmailResult> {
    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: options.to }] }],
                from: { email: 'noreply@rentbase.app', name: 'RentBase' },
                subject: options.subject,
                content: [
                    { type: 'text/html', value: options.html },
                    ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
                ],
            }),
        })

        if (response.ok || response.status === 202) {
            return { success: true, messageId: response.headers.get('x-message-id') || 'sent' }
        }

        const data = await response.json()
        return { success: false, error: data.errors?.[0]?.message || 'Failed to send email' }
    } catch (error: any) {
        console.error('[Email] SendGrid error:', error)
        return { success: false, error: error.message }
    }
}

// ============================================
// Email Templates
// ============================================

/**
 * Generate Contract Ready email
 */
export function contractReadyEmail(contractId: string, landlordName: string, tenantName: string, propertyAddress: string): EmailOptions {
    const appUrl = process.env.NUXT_PUBLIC_APP_URL || 'https://rentbase.app'
    const viewUrl = `${appUrl}/contract/preview/${contractId}`

    return {
        to: '', // Set by caller
        subject: '📜 Your RentBase Contract is Ready',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #050505; margin: 0; padding: 0; background-color: #F7F7F5; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: white; border-radius: 8px; padding: 32px; border: 1px solid #E1E1E1; }
          .logo { width: 40px; height: 40px; background: #0075DE; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 20px; margin-bottom: 24px; }
          h1 { font-size: 24px; margin: 0 0 16px 0; color: #050505; }
          p { color: #666666; margin: 0 0 16px 0; }
          .detail { background: #F7F7F5; border-radius: 8px; padding: 16px; margin: 24px 0; }
          .detail-label { font-size: 10px; font-weight: 700; color: #666666; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
          .detail-value { font-size: 14px; font-weight: 500; color: #050505; }
          .button { display: inline-block; background: #0075DE; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 16px; }
          .button:hover { background: #005BAB; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">⚡</div>
            <h1>Your Contract is Ready</h1>
            <p>Great news! Your tenancy agreement has been generated and is ready for review.</p>
            
            <div class="detail">
              <div class="detail-label">Property</div>
              <div class="detail-value">${propertyAddress}</div>
            </div>
            
            <div class="detail">
              <div class="detail-label">Parties</div>
              <div class="detail-value">Landlord: ${landlordName}<br>Tenant: ${tenantName}</div>
            </div>
            
            <a href="${viewUrl}" class="button">View Contract →</a>
            
            <p style="margin-top: 24px; font-size: 13px;">
              Once both parties sign the contract, you'll receive a finalized PDF.
            </p>
          </div>
          
          <div class="footer">
            <p>RentBase • The trusted platform for renters in Ghana</p>
            <p><a href="${appUrl}" style="color: #0075DE;">rentbase.app</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Your RentBase Contract is Ready\n\nProperty: ${propertyAddress}\nLandlord: ${landlordName}\nTenant: ${tenantName}\n\nView your contract: ${viewUrl}\n\n- RentBase`,
    }
}

/**
 * Generate Signing Request email
 */
export function signingRequestEmail(contractId: string, signerName: string, signerRole: 'landlord' | 'tenant', signingToken: string): EmailOptions {
    const appUrl = process.env.NUXT_PUBLIC_APP_URL || 'https://rentbase.app'
    const signUrl = `${appUrl}/contract/sign/${signingToken}`

    return {
        to: '', // Set by caller
        subject: `✍️ Please Sign Your Tenancy Agreement`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #050505; margin: 0; padding: 0; background-color: #F7F7F5; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: white; border-radius: 8px; padding: 32px; border: 1px solid #E1E1E1; }
          .logo { width: 40px; height: 40px; background: #0075DE; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 20px; margin-bottom: 24px; }
          h1 { font-size: 24px; margin: 0 0 16px 0; color: #050505; }
          p { color: #666666; margin: 0 0 16px 0; }
          .button { display: inline-block; background: #0075DE; color: white !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500; margin-top: 16px; font-size: 16px; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">⚡</div>
            <h1>Signature Required</h1>
            <p>Hi ${signerName},</p>
            <p>A tenancy agreement is awaiting your signature as the <strong>${signerRole}</strong>.</p>
            <p>Please review the contract and sign digitally to complete the agreement.</p>
            
            <a href="${signUrl}" class="button">Review & Sign Contract →</a>
            
            <p style="margin-top: 24px; font-size: 13px; color: #999999;">
              This link expires in 7 days. If you have questions, contact the other party directly.
            </p>
          </div>
          
          <div class="footer">
            <p>RentBase • The trusted platform for renters in Ghana</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hi ${signerName},\n\nA tenancy agreement is awaiting your signature as the ${signerRole}.\n\nSign here: ${signUrl}\n\nThis link expires in 7 days.\n\n- RentBase`,
    }
}

/**
 * Generate New Review Notification email (for agents)
 */
export function newReviewEmail(agentName: string, rating: number, comment: string, agentPhone: string): EmailOptions {
    const appUrl = process.env.NUXT_PUBLIC_APP_URL || 'https://rentbase.app'
    const profileUrl = `${appUrl}/agent/${agentPhone}`
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

    return {
        to: '', // Set by caller
        subject: `⭐ New ${rating}-Star Review on RentBase`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #050505; margin: 0; padding: 0; background-color: #F7F7F5; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: white; border-radius: 8px; padding: 32px; border: 1px solid #E1E1E1; }
          h1 { font-size: 24px; margin: 0 0 16px 0; }
          .stars { font-size: 24px; color: #F59E0B; letter-spacing: 2px; margin: 16px 0; }
          .comment { background: #F7F7F5; border-radius: 8px; padding: 16px; font-style: italic; color: #666666; margin: 16px 0; }
          .button { display: inline-block; background: #0075DE; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 16px; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>New Review Received</h1>
            <p>Hi ${agentName},</p>
            <p>Someone just left you a review on RentBase!</p>
            
            <div class="stars">${stars}</div>
            
            ${comment ? `<div class="comment">"${comment}"</div>` : ''}
            
            <a href="${profileUrl}" class="button">View Your Profile →</a>
          </div>
          
          <div class="footer">
            <p>Keep providing great service to earn more positive reviews!</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hi ${agentName},\n\nYou received a new ${rating}-star review on RentBase!\n\n${comment ? `"${comment}"\n\n` : ''}View your profile: ${profileUrl}\n\n- RentBase`,
    }
}
