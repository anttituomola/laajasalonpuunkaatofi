# Email Deliverability Guide

## Problem: Emails Going to Spam

If your contact form emails are going to spam, follow these steps to improve deliverability.

## ✅ Immediate Improvements (Already Implemented)

1. **HTML Email Format** - Added HTML version alongside plain text
2. **Proper Email Headers** - Improved email structure
3. **Reply-To Fix** - Changed Reply-To to use verified sender instead of user's email (prevents spam flags)

## 🔧 Required: DNS Authentication Records

The most important step to prevent spam is setting up **SPF, DKIM, and DMARC** DNS records. These authenticate your emails and prove they're legitimate.

### Option 1: Use Your Custom Domain (Recommended)

If you have a custom domain (e.g., `laajasalonpuunkaatofi.fi`), verify it in AWS SES and set up DNS records.

#### Step 1: Verify Domain in AWS SES

1. Go to AWS Console → SES → Verified identities
2. Click "Create identity"
3. Select "Domain"
4. Enter your domain (e.g., `laajasalonpuunkaatofi.fi`)
5. AWS will provide DNS records to add

#### Step 2: Add DNS Records

AWS SES will provide these records. Add them to your domain's DNS:

**SPF Record** (TXT record):
```
v=spf1 include:amazonses.com ~all
```

**DKIM Records** (3 CNAME records):
```
[selector1]._domainkey.yourdomain.com → [selector1].dkim.amazonses.com
[selector2]._domainkey.yourdomain.com → [selector2].dkim.amazonses.com
[selector3]._domainkey.yourdomain.com → [selector3].dkim.amazonses.com
```

**DMARC Record** (TXT record):
```
_dmarc.yourdomain.com TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

#### Step 3: Update Environment Variable

Change `ADMIN_EMAIL` to use your domain:
```env
ADMIN_EMAIL=noreply@laajasalonpuunkaatofi.fi
```

### Option 2: Continue Using Gmail (Less Ideal)

If you must use Gmail, you can only verify the email address (not the domain). This provides less authentication:

1. ✅ Already done: Email address verified in AWS SES
2. ⚠️ Limited: No SPF/DKIM for Gmail domain
3. ⚠️ Result: Lower deliverability than custom domain

## 📋 Additional Steps to Improve Deliverability

### 1. Warm Up Your Sending Reputation

- Start with low volume (1-5 emails/day)
- Gradually increase over 1-2 weeks
- AWS SES sandbox limits help with this

### 2. Request Production Access in AWS SES

If you're still in sandbox mode:
1. Go to SES → Account dashboard
2. Click "Request production access"
3. Fill out the form (usually approved within 24 hours)

### 3. Monitor Email Metrics

- Check AWS SES → Sending statistics
- Watch bounce and complaint rates
- Keep bounce rate < 5% and complaint rate < 0.1%

### 4. Email Content Best Practices

✅ **Do:**
- Use clear, professional subject lines
- Include both HTML and plain text versions (already done)
- Keep content relevant and non-spammy
- Include your business name and contact info

❌ **Avoid:**
- ALL CAPS in subject lines
- Excessive exclamation marks!!!
- Spam trigger words ("free", "urgent", "click here", etc.)
- Too many links or images

### 5. Test Email Deliverability

Use these tools to test your email setup:
- [Mail-Tester.com](https://www.mail-tester.com/) - Send test email, get spam score
- [MXToolbox](https://mxtoolbox.com/) - Check SPF/DKIM/DMARC records
- [Google Postmaster Tools](https://postmaster.google.com/) - Monitor Gmail deliverability

### 6. Gmail-Specific Actions

Since you're receiving emails in Gmail:

1. **Mark as Not Spam** ✅ (You've done this)
2. **Add to Contacts** - Add the sender email to your contacts
3. **Create Filter** - Create a Gmail filter to always deliver emails from this sender to inbox
4. **Wait** - Gmail learns over time. After marking several as "not spam", it should improve

### 7. Consider Using a Dedicated Email Service

For better deliverability, consider:
- **Resend** - Modern email API, great deliverability
- **SendGrid** - Popular, good deliverability
- **Mailgun** - Developer-friendly
- **Postmark** - Excellent deliverability, transaction emails

## 🎯 Priority Actions

**High Priority:**
1. ✅ Set up SPF/DKIM/DMARC records (if using custom domain)
2. ✅ Use custom domain email instead of Gmail
3. ✅ Monitor bounce/complaint rates in AWS SES

**Medium Priority:**
4. Request AWS SES production access
5. Warm up sending reputation gradually
6. Test with Mail-Tester.com

**Low Priority:**
7. Consider switching to dedicated email service
8. Set up email analytics/tracking

## 📊 Expected Results

After implementing DNS records:
- **Before:** 30-50% spam rate
- **After:** < 5% spam rate (with proper setup)

## 🔍 Troubleshooting

**Still going to spam after DNS setup?**
- Wait 24-48 hours for DNS propagation
- Verify DNS records with MXToolbox
- Check AWS SES sending statistics for issues
- Test with Mail-Tester.com

**High bounce rate?**
- Verify recipient email addresses are valid
- Check AWS SES sandbox restrictions
- Review bounce notifications in SES

**Gmail still filtering?**
- Continue marking as "not spam"
- Add sender to contacts
- Create Gmail filter
- Consider using a different email provider

## 📚 Resources

- [AWS SES Best Practices](https://docs.aws.amazon.com/ses/latest/dg/best-practices.html)
- [Gmail Postmaster Tools](https://postmaster.google.com/)
- [SPF Record Syntax](https://www.openspf.org/SPF_Record_Syntax)
- [DMARC Guide](https://dmarc.org/wiki/FAQ)

