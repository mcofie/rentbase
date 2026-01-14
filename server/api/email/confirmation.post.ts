import { defineEventHandler, readBody } from 'h3'
import { sendEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const {
        type, // 'contract' | 'deposit_report'
        email,
        recipientName,
        reportCode,
        propertyAddress,
        viewUrl,
        pdfBase64, // Optional - PDF attachment
        expiryDate
    } = body

    if (!email || !type) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: email and type'
        })
    }

    const isContract = type === 'contract'
    const documentName = isContract ? 'Tenancy Agreement' : 'Condition Report'
    const productName = isContract ? 'Pocket Lawyer' : 'Deposit Shield'

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentName} Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 500px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <div style="width: 48px; height: 48px; background-color: #050505; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px;">📄</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; color: #0a0a0a; font-weight: 700;">
                Your ${documentName} is Ready!
              </h1>
              <p style="margin: 10px 0 0; color: #737373; font-size: 14px;">
                via RentBase ${productName}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="margin: 0 0 20px; color: #404040; font-size: 15px; line-height: 1.6;">
                Hi${recipientName ? ` ${recipientName}` : ''},
              </p>
              <p style="margin: 0 0 25px; color: #404040; font-size: 15px; line-height: 1.6;">
                Your ${documentName.toLowerCase()} has been securely stored and is ready to access.
              </p>
              
              <!-- Code Box -->
              <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
                <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #737373; font-weight: 600;">
                  Your Access Code
                </p>
                <p style="margin: 0; font-family: monospace; font-size: 28px; font-weight: 700; color: #0a0a0a; letter-spacing: 3px;">
                  ${reportCode || 'N/A'}
                </p>
              </div>
              
              ${propertyAddress ? `
              <div style="background-color: #fafafa; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 0.5px;">Property</p>
                <p style="margin: 5px 0 0; font-size: 15px; color: #0a0a0a; font-weight: 500;">${propertyAddress}</p>
              </div>
              ` : ''}
              
              <!-- CTA Button -->
              <a href="${viewUrl}" style="display: block; background-color: #050505; color: #ffffff; text-decoration: none; padding: 16px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center;">
                View ${documentName}
              </a>
              
              <p style="margin: 25px 0 0; color: #737373; font-size: 13px; line-height: 1.6; text-align: center;">
                ${expiryDate ? `This document will be stored until <strong>${expiryDate}</strong>.` : 'Keep this email for your records.'}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 25px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0; color: #a3a3a3; font-size: 12px; text-align: center;">
                RentBase • Secure Property Documentation
              </p>
              <p style="margin: 8px 0 0; color: #a3a3a3; font-size: 12px; text-align: center;">
                <a href="https://rentbase.app" style="color: #737373;">rentbase.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

    const attachments = pdfBase64 ? [{
        filename: `${documentName.replace(/\s/g, '_')}_${reportCode || 'document'}.pdf`,
        content: pdfBase64 as string,
        encoding: 'base64' as const
    }] : undefined

    try {
        const result = await sendEmail({
            to: email,
            subject: `Your ${documentName} is Ready - ${reportCode || 'RentBase'}`,
            html: htmlContent,
            attachments
        })

        return {
            success: true,
            messageId: result?.messageId
        }
    } catch (error: any) {
        console.error('Email confirmation failed:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to send confirmation email'
        })
    }
})
