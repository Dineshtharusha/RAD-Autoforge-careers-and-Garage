import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends an email using Nodemailer.
 * Falls back to console output if SMTP credentials are not yet configured.
 */
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; preview?: string }> => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
  const emailFrom = process.env.EMAIL_FROM || emailUser || 'noreply@autoforge.com';

  // If no SMTP credentials configured, log link to console for demo/development
  if (!emailUser || !emailPass) {
    console.log('\n==================================================');
    console.log('📧 [AUTOFORGE EMAIL DISPATCHER - DEV SIMULATION]');
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('SMTP Credentials (EMAIL_USER / EMAIL_PASS) not set in server/.env.');
    console.log('Simulation dispatch succeeded.');
    console.log('==================================================\n');
    return { success: true, preview: 'simulation-mode' };
  }

  try {
    const cleanPass = emailPass.replace(/\s+/g, '');
    const isGmail = emailHost.includes('gmail') || emailUser.endsWith('@gmail.com');

    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: 'gmail',
            auth: {
              user: emailUser,
              pass: cleanPass,
            },
          }
        : {
            host: emailHost,
            port: emailPort,
            secure: emailPort === 465,
            auth: {
              user: emailUser,
              pass: cleanPass,
            },
          }
    );

    const info = await transporter.sendMail({
      from: `"AutoForge Careers & Garage" <${emailUser}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.subject,
      html: options.html,
    });

    console.log(`📧 [AutoForge Email] Sent successfully to ${options.to} (MessageId: ${info.messageId})`);
    return { success: true, preview: info.messageId };
  } catch (error: any) {
    console.error('❌ [AutoForge Email Error]:', error.message);
    // Don't crash the server if SMTP fails, return gracefully
    return { success: false, preview: error.message };
  }
};

/**
 * Generates an AutoForge luxury dark-gold styled email template.
 */
export const createAutoForgeEmailTemplate = (
  title: string,
  preheader: string,
  mainText: string,
  buttonText: string,
  buttonLink: string,
  securityNote: string
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B10; margin: 0; padding: 20px; color: #E5E7EB; }
    .card { max-width: 600px; margin: 0 auto; background: #0E131D; border: 1px solid #232B3C; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #161D2B 0%, #0A0D13 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #232B3C; }
    .logo-badge { display: inline-block; background: #E5A93C; color: #080B10; font-weight: 900; font-size: 20px; padding: 6px 14px; border-radius: 8px; letter-spacing: -1px; margin-bottom: 12px; }
    .brand-title { color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 2px; }
    .brand-sub { color: #E5A93C; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; margin-top: 4px; }
    .body { padding: 36px 32px; }
    .headline { font-size: 20px; font-weight: 700; color: #FFFFFF; margin-bottom: 16px; }
    .text { font-size: 14px; line-height: 1.6; color: #9CA3AF; margin-bottom: 28px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background: #E5A93C; color: #080B10 !important; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 32px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block; box-shadow: 0 4px 15px rgba(229,169,60,0.3); }
    .alt-link { font-size: 11px; color: #6B7280; word-break: break-all; margin-top: 16px; }
    .footer { background: #0A0D13; padding: 20px 32px; text-align: center; border-top: 1px solid #1A2130; font-size: 11px; color: #6B7280; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo-badge">AF</div>
      <h1 class="brand-title">AUTOFORGE</h1>
      <div class="brand-sub">Careers & Garage Network</div>
    </div>
    <div class="body">
      <div class="headline">${title}</div>
      <p class="text">${mainText}</p>
      <div class="btn-container">
        <a href="${buttonLink}" class="btn" target="_blank">${buttonText}</a>
      </div>
      <p class="alt-link">Or copy and paste this direct link into your browser:<br/><a href="${buttonLink}" style="color: #E5A93C;">${buttonLink}</a></p>
      <div style="border-top: 1px solid #1E2535; margin-top: 24px; padding-top: 16px;">
        <p style="font-size: 11px; color: #9CA3AF; margin: 0;">${securityNote}</p>
      </div>
    </div>
    <div class="footer">
      AutoForge Regional Superhub Network &bull; Galle &bull; Hikkaduwa &bull; Ambalangoda<br/>
      Licensed Sri Lanka Roadside Recovery & Master Certified Automotive Garage.
    </div>
  </div>
</body>
</html>
  `;
};
