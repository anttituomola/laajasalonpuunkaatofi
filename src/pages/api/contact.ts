import type { APIRoute } from 'astro';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Mark this endpoint as server-rendered (not static)
export const prerender = false;

// Initialize SES client only if AWS credentials are provided
// Using process.env instead of import.meta.env to prevent build-time inlining
const getSESClient = () => {
  // Use process.env for runtime environment variables (not inlined at build time)
  const region = process.env.AWS_SDK_REGION;
  const accessKeyId = process.env.AWS_SDK_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SDK_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Handle both FormData and JSON requests
    let name = '';
    let phone = '';
    let email = '';
    let message = '';
    let website = ''; // Honeypot field

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON request
      const body = await request.json();
      name = body.name || '';
      phone = body.phone || '';
      email = body.email || '';
      message = body.message || '';
      website = body.website || '';
    } else {
      // Handle FormData request
      const formData = await request.formData();
      name = formData.get('name')?.toString() || '';
      phone = formData.get('phone')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      message = formData.get('message')?.toString() || '';
      website = formData.get('website')?.toString() || '';
    }

    // Honeypot spam check - if website field is filled, it's likely a bot
    if (website && website.trim().length > 0) {
      // Silently reject spam submissions (don't reveal the honeypot)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Viesti lähetetty onnistuneesti! Otamme yhteyttä mahdollisimman pian.' 
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validation
    if (!name || !phone || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Kaikki kentät ovat pakollisia.' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Virheellinen sähköpostiosoite.' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Use process.env to prevent build-time inlining of secrets
    const senderEmail = process.env.ADMIN_EMAIL || 'anttituomola8@gmail.com';
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || process.env.ADMIN_EMAIL || 'anttituomola8@gmail.com';
    const bccEmail = process.env.ADMIN_EMAIL || 'anttituomola8@gmail.com';
    const sesClient = getSESClient();

    if (!sesClient) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Sähköpostipalvelu ei ole konfiguroitu. Ota yhteyttä suoraan puhelimitse.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create email content
    const emailSubject = `Yhteydenotto verkkosivulta - ${name}`;
    const timestamp = new Date().toLocaleString('fi-FI');
    
    // Plain text version
    const textBody = `
Uusi yhteydenotto Laajasalon Puunkaatopalvelun verkkosivulta:

Nimi: ${name}
Puhelin: ${phone}
Sähköposti: ${email}

Viesti:
${message}

---
Lähetetty: ${timestamp}
    `.trim();

    // HTML version for better deliverability
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2d5016; border-bottom: 2px solid #2d5016; padding-bottom: 10px;">
    Uusi yhteydenotto verkkosivulta
  </h2>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>Nimi:</strong> ${escapeHtml(name)}</p>
    <p><strong>Puhelin:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Sähköposti:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #2d5016;">Viesti:</h3>
    <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2d5016; border-radius: 3px;">
${escapeHtml(message)}
    </p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <p style="color: #666; font-size: 0.9em;">
    Lähetetty: ${timestamp}
  </p>
</body>
</html>
    `.trim();

    // Build destination object conditionally
    const destination: { ToAddresses: string[]; BccAddresses?: string[] } = {
      ToAddresses: [recipientEmail],
    };
    
    // Only add BCC if different from recipient to avoid duplicates
    if (bccEmail && bccEmail !== recipientEmail) {
      destination.BccAddresses = [bccEmail];
    }

    // Send email using AWS SES
    const command = new SendEmailCommand({
      Source: senderEmail, // SES verified sender email (must be verified in AWS SES)
      Destination: destination,
      Message: {
        Subject: {
          Data: emailSubject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
        },
      },
      // Reply-To uses customer's email so you can reply directly to them
      ReplyToAddresses: [email],
      // Add configuration set for better tracking (optional)
      ...(process.env.AWS_SES_CONFIGURATION_SET && {
        ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
      }),
    });

    await sesClient.send(command);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Viesti lähetetty onnistuneesti! Otamme yhteyttä mahdollisimman pian.' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Viestin lähettäminen epäonnistui. Yritä myöhemmin uudelleen tai ota yhteyttä suoraan puhelimitse.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

