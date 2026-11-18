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
            connectionTimeout: 6000, // 6 seconds fast-fail if cloud firewall blocks SMTP
            greetingTimeout: 5000,
            socketTimeout: 8000,
          }
        : {
            host: emailHost,
            port: emailPort,
            secure: emailPort === 465,
            auth: {
              user: emailUser,
              pass: cleanPass,
            },
            connectionTimeout: 6000,
            greetingTimeout: 5000,
            socketTimeout: 8000,
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

/**
 * Generates an AutoForge luxury OTP email template displaying a prominent 6-digit code.
 */
export const createAutoForgeOTPEmailTemplate = (
  title: string,
  name: string,
  otpCode: string,
  purposeDescription: string,
  validityMinutes: number = 15
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B10; margin: 0; padding: 20px; color: #E5E7EB; }
    .card { max-width: 540px; margin: 0 auto; background: #0E131D; border: 1px solid #232B3C; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
    .header { background: linear-gradient(135deg, #161D2B 0%, #0A0D13 100%); padding: 30px 24px; text-align: center; border-bottom: 1px solid #232B3C; }
    .logo-badge { display: inline-block; background: #E5A93C; color: #080B10; font-weight: 900; font-size: 20px; padding: 6px 14px; border-radius: 8px; letter-spacing: -1px; margin-bottom: 10px; }
    .brand-title { color: #FFFFFF; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 2px; }
    .brand-sub { color: #E5A93C; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; margin-top: 4px; }
    .body { padding: 36px 32px; text-align: center; }
    .headline { font-size: 18px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #9CA3AF; margin-bottom: 24px; }
    .otp-container { background: #141A26; border: 2px dashed #E5A93C; border-radius: 12px; padding: 20px; margin: 24px 0; display: inline-block; min-width: 280px; }
    .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #E5A93C; font-weight: 700; margin-bottom: 8px; }
    .otp-code { font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 34px; font-weight: 800; letter-spacing: 12px; color: #FFFFFF; margin-right: -12px; }
    .note { font-size: 12px; color: #6B7280; line-height: 1.5; margin-top: 20px; }
    .footer { background: #0A0D13; padding: 18px 24px; text-align: center; border-top: 1px solid #1A2130; font-size: 11px; color: #6B7280; }
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
      <p class="text">Hi ${name}, ${purposeDescription}</p>
      <div class="otp-container">
        <div class="otp-label">Your One-Time Passcode</div>
        <div class="otp-code">${otpCode}</div>
      </div>
      <p class="note">This code is valid for <strong>${validityMinutes} minutes</strong>. Please do not share this passcode with anyone.</p>
    </div>
    <div class="footer">
      AutoForge Regional Superhub Network &bull; Galle &bull; Hikkaduwa &bull; Ambalangoda
    </div>
  </div>
</body>
</html>
  `;
};
