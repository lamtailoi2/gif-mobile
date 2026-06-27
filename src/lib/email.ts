import { BREVO_API_KEY, BREVO_SENDER_EMAIL } from './env';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
}

/**
 * Sends an email using the Brevo (formerly Sendinblue) REST API v3.
 * Completely free, allows sending to any recipient without domain verification
 * (only requires verifying the sender email address in your Brevo account).
 * 
 * @param params Email configurations (to, subject, body, html)
 * @returns boolean indicating if the email was successfully sent
 */
export async function sendEmail({ to, subject, body, html }: SendEmailParams): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.warn('[EmailService] EXPO_PUBLIC_BREVO_API_KEY is not defined in env. Skip sending email.');
    return false;
  }
  if (!BREVO_SENDER_EMAIL) {
    console.warn('[EmailService] EXPO_PUBLIC_BREVO_SENDER_EMAIL is not defined in env. Skip sending email.');
    return false;
  }

  try {
    const toArray = Array.isArray(to) ? to : [to];
    
    // Format recipients according to Brevo API v3 format: [{"email": "user@example.com", "name": "User"}]
    const recipients = toArray.map(email => ({ email }));

    const formattedHtml = html || `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <div style="background-color: #10B981; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; font-size: 20px; font-weight: bold;">
          G.I.F Workout Assistant
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; background-color: #fff;">
          <p>${body.replace(/\n/g, '<br />')}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Đây là email tự động từ hệ thống GIF. Hãy giữ vững phong độ tập luyện nhé!</p>
        </div>
      </div>
    `;

    // Brevo API v3 Send SMTP Email endpoint
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'GIF App',
          email: BREVO_SENDER_EMAIL,
        },
        to: recipients,
        subject: subject,
        htmlContent: formattedHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[EmailService] Brevo API Error Response:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('[EmailService] Email sent successfully via Brevo API. Message ID:', data.messageId);
    return true;
  } catch (error) {
    console.error('[EmailService] Failed to send email via Brevo REST API:', error);
    return false;
  }
}

/**
 * Triggers a workout reminder email.
 */
export async function sendWorkoutReminderEmail(email: string, userName: string) {
  const subject = "Đã đến giờ tập luyện rồi! 💪";
  const body = `Chào ${userName},\n\nHôm nay bạn chưa hoàn thành bài tập nào. Hãy dành ra 30 phút luyện tập hôm nay để duy trì phong độ và giữ vững chuỗi streak nhé!`;
  
  return sendEmail({
    to: email,
    subject,
    body,
  });
}

/**
 * Triggers an AI Plan ready notification email.
 */
export async function sendAiPlanReadyEmail(email: string, userName: string) {
  const subject = "Giáo án AI mới đã sẵn sàng cho bạn! ⚡";
  const body = `Chào ${userName},\n\nAI đã tính toán và lập xong kế hoạch tập luyện cá nhân hóa của tuần này dựa trên mục tiêu của bạn. Mở app ngay để khám phá giáo án của bạn nhé!`;
  
  return sendEmail({
    to: email,
    subject,
    body,
  });
}
