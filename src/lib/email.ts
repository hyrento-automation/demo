import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Only initialize if we have the API key
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    return null;
  }

  try {
    const data = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'} <${process.env.RESEND_FROM_EMAIL || 'pleasuredriveltd@gmail.com'}>`,
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    return null;
  }
};
