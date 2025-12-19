# Contact Form Setup Guide

## Overview

The contact form uses AWS SES (Simple Email Service) to send emails. Follow these steps to set it up.

## Prerequisites

1. AWS Account
2. AWS SES configured and verified email address
3. IAM user with SES permissions

## Step 1: Configure AWS SES

### 1.1 Verify Email Address in SES

1. Go to AWS Console → SES (Simple Email Service)
2. Navigate to "Verified identities" → "Create identity"
3. Select "Email address"
4. Enter your email (e.g., `anttituomola8@gmail.com`)
5. Click "Create identity"
6. Check your email and verify the address

### 1.2 Create IAM User for SES

1. Go to AWS Console → IAM
2. Create a new user (e.g., `ses-contact-form`)
3. Attach policy: `AmazonSESFullAccess` (or create custom policy with only `ses:SendEmail` permission)
4. Create access keys
5. Save the Access Key ID and Secret Access Key

### 1.3 Move Out of SES Sandbox (Optional but Recommended)

If you're in SES sandbox mode, you can only send to verified emails. To send to any email:
1. Go to SES → Account dashboard
2. Request production access
3. Fill out the form (usually approved within 24 hours)

## Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
ADMIN_EMAIL=anttituomola8@gmail.com
CONTACT_RECIPIENT_EMAIL=your-recipient-email@example.com
AWS_SDK_REGION=eu-north-1
AWS_SDK_ACCESS_KEY_ID=your-access-key-id-here
AWS_SDK_SECRET_ACCESS_KEY=your-secret-access-key-here
```

**Important:** 
- The `ADMIN_EMAIL` must be verified in AWS SES (used as sender/From address)
- `CONTACT_RECIPIENT_EMAIL` is the email address where contact form submissions will be sent (can be different from ADMIN_EMAIL)
- If `CONTACT_RECIPIENT_EMAIL` is not set, it will default to `ADMIN_EMAIL`
- Use the same region where you verified your email
- Never commit `.env` to git (it's already in `.gitignore`)

## Step 3: Test the Form

1. Start the dev server: `npm run dev`
2. Navigate to the contact page
3. Fill out and submit the form
4. Check your email inbox

## Troubleshooting

### Error: "Sähköpostipalvelu ei ole konfiguroitu"
- Check that all environment variables are set in `.env`
- Restart the dev server after adding/changing `.env` variables

### Error: "Email address not verified"
- Verify your email address in AWS SES console
- Make sure `ADMIN_EMAIL` matches the verified email

### Error: "Access Denied"
- Check IAM user has SES permissions
- Verify access keys are correct
- Ensure region matches where email is verified

### Error: "Rate exceeded"
- You're in SES sandbox mode (limited to 200 emails/day)
- Request production access in SES console

## Production Deployment

### Netlify
1. Go to Site settings → Environment variables
2. Add all variables from `.env`
3. Redeploy

### Vercel
1. Go to Project settings → Environment variables
2. Add all variables from `.env`
3. Redeploy

### Other Platforms
Add environment variables through your hosting platform's dashboard.

## Security Notes

- Never expose AWS credentials in client-side code
- Use environment variables only
- Rotate access keys regularly
- Use least-privilege IAM policies
- Consider using AWS Secrets Manager for production

## Alternative: Use Different Email Service

If you prefer not to use AWS SES, you can modify `src/pages/api/contact.ts` to use:
- SendGrid
- Mailgun
- Nodemailer with SMTP
- Resend
- Or any other email service

