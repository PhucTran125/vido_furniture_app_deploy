import nodemailer from 'nodemailer';

const isDev = process.env.NODE_ENV !== 'production';

function createGmailTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_SENDER_EMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });
}

async function createEtherealTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal test account created:', testAccount.user);
  console.log('View emails at: https://ethereal.email/login');
  console.log('  User:', testAccount.user);
  console.log('  Pass:', testAccount.pass);
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Cache Ethereal transporter across requests (avoid creating new accounts each time)
let etherealTransporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (isDev) {
    if (!etherealTransporter) {
      etherealTransporter = await createEtherealTransporter();
    }
    return etherealTransporter;
  }
  // Create a fresh transporter each request in production
  // to avoid stale OAuth2 tokens in serverless environments
  return createGmailTransporter();
}

interface InquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendCustomerConfirmation(data: InquiryData) {
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #1a1a2e; padding: 30px 40px; text-align: center;">
        <h1 style="color: #c8a97e; font-size: 24px; margin: 0; letter-spacing: 2px;">VIDO FURNITURE</h1>
        <p style="color: #888; font-size: 11px; margin: 8px 0 0; letter-spacing: 1px; text-transform: uppercase;">Premium Vietnamese Craftsmanship</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px;">
        <h2 style="color: #1a1a2e; font-size: 20px; margin: 0 0 20px; font-weight: 600;">Thank You for Your Inquiry</h2>
        <p style="color: #444; line-height: 1.8; font-size: 14px; margin: 0 0 16px;">
          Dear ${data.firstName} ${data.lastName},
        </p>
        <p style="color: #444; line-height: 1.8; font-size: 14px; margin: 0 0 24px;">
          Thank you for your interest in VIDO Furniture. Our sales team has received your inquiry and will respond within <strong>24 business hours</strong>.
        </p>

        <!-- Inquiry Summary -->
        <div style="background: #f9f8f6; border-left: 4px solid #c8a97e; padding: 20px; margin: 0 0 24px;">
          <h3 style="color: #1a1a2e; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">Your Inquiry Summary</h3>
          <table style="width: 100%; font-size: 14px; color: #555;">
            <tr><td style="padding: 4px 0; font-weight: 600; width: 80px;">Name:</td><td style="padding: 4px 0;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: 600;">Email:</td><td style="padding: 4px 0;">${data.email}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: 600;">Phone:</td><td style="padding: 4px 0;">${data.phone}</td></tr>
            ${data.message ? `<tr><td style="padding: 4px 0; font-weight: 600; vertical-align: top;">Message:</td><td style="padding: 4px 0;">${data.message}</td></tr>` : ''}
          </table>
        </div>

        <!-- Contact Info -->
        <p style="color: #444; line-height: 1.8; font-size: 14px; margin: 0 0 8px;">
          In the meantime, feel free to reach us directly:
        </p>
        <p style="color: #444; font-size: 14px; margin: 0 0 4px;">
          <strong>Sales:</strong> <a href="mailto:sales01@vidointernational.com" style="color: #c8a97e; text-decoration: none;">sales01@vidointernational.com</a> / (+86) 13960794413
        </p>
        <p style="color: #444; font-size: 14px; margin: 0 0 24px;">
          <strong>Sales:</strong> <a href="mailto:sales02@vidointernational.com" style="color: #c8a97e; text-decoration: none;">sales02@vidointernational.com</a> / (+84) 792089618
        </p>

        <p style="color: #444; line-height: 1.8; font-size: 14px; margin: 0;">
          Warm regards,<br/>
          <strong style="color: #1a1a2e;">VIDO Furniture Sales Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
        <p style="color: #999; font-size: 11px; margin: 0 0 4px;">VIDO VIET NAM FURNITURE JOINT STOCK COMPANY</p>
        <p style="color: #aaa; font-size: 11px; margin: 0;">Phuong La Village, Thai Phuong Commune, Hung Ha District, Thai Binh Province, Vietnam</p>
      </div>
    </div>
  `;

  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: `"VIDO Furniture" <${process.env.GMAIL_SENDER_EMAIL || 'noreply@vido.test'}>`,
    to: data.email,
    subject: 'Thank you for your inquiry - VIDO Furniture',
    html,
  });

  if (isDev) {
    console.log('Customer confirmation preview:', nodemailer.getTestMessageUrl(info));
  }
}

export async function sendCompanyNotification(data: InquiryData) {
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' });
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #1a1a2e; padding: 24px 40px;">
        <h1 style="color: #c8a97e; font-size: 18px; margin: 0; letter-spacing: 1px;">NEW INQUIRY</h1>
        <p style="color: #888; font-size: 12px; margin: 6px 0 0;">${timestamp} (Vietnam Time)</p>
      </div>

      <!-- Customer Details -->
      <div style="padding: 30px 40px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #888; font-weight: 600; width: 100px; vertical-align: top;">Name</td>
            <td style="padding: 12px 0; color: #222; font-weight: 600; font-size: 16px;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #888; font-weight: 600; vertical-align: top;">Email</td>
            <td style="padding: 12px 0;"><a href="mailto:${data.email}" style="color: #c8a97e; text-decoration: none; font-size: 14px;">${data.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #888; font-weight: 600; vertical-align: top;">Phone</td>
            <td style="padding: 12px 0;"><a href="tel:${data.phone}" style="color: #c8a97e; text-decoration: none; font-size: 14px;">${data.phone}</a></td>
          </tr>
          ${data.message ? `
          <tr>
            <td style="padding: 12px 0; color: #888; font-weight: 600; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${data.message}</td>
          </tr>` : ''}
        </table>

      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 16px 40px; text-align: center;">
        <p style="color: #aaa; font-size: 11px; margin: 0;">Sent from VIDO Furniture website contact form</p>
      </div>
    </div>
  `;

  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: `"VIDO Website" <${process.env.GMAIL_SENDER_EMAIL || 'noreply@vido.test'}>`,
    to: 'sales01@vidointernational.com',
    subject: `New Inquiry from ${data.firstName} ${data.lastName}`,
    html,
  });

  if (isDev) {
    console.log('Company notification preview:', nodemailer.getTestMessageUrl(info));
  }
}
