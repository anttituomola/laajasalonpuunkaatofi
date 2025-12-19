import type { APIRoute } from 'astro';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

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

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON request
      const body = await request.json();
      name = body.name || '';
      phone = body.phone || '';
      email = body.email || '';
      message = body.message || '';
    } else {
      // Handle FormData request
      const formData = await request.formData();
      name = formData.get('name')?.toString() || '';
      phone = formData.get('phone')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      message = formData.get('message')?.toString() || '';
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
    const adminEmail = process.env.ADMIN_EMAIL || 'anttituomola8@gmail.com';
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
    const emailBody = `
Uusi yhteydenotto Laajasalon Puunkaatopalvelun verkkosivulta:

Nimi: ${name}
Puhelin: ${phone}
Sähköposti: ${email}

Viesti:
${message}

---
Lähetetty: ${new Date().toLocaleString('fi-FI')}
    `.trim();

    // Send email using AWS SES
    const command = new SendEmailCommand({
      Source: adminEmail, // SES verified sender email
      Destination: {
        ToAddresses: [adminEmail],
      },
      Message: {
        Subject: {
          Data: emailSubject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: [email],
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

