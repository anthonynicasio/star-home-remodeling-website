import { Resend } from 'resend';
import type { LeadFormData } from './lead-schema';
import { siteConfig } from './site-config';

export interface SendLeadResult {
  success: boolean;
  message: string;
}

export async function sendLead(data: LeadFormData): Promise<SendLeadResult> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = siteConfig.leadEmail || import.meta.env.LEAD_EMAIL;

  if (!apiKey || !to) {
    console.warn('[sendLead] RESEND_API_KEY or LEAD_EMAIL not configured    logging lead only.');
    console.info('[sendLead] Lead received:', JSON.stringify(data, null, 2));
    return {
      success: true,
      message: 'Lead logged (email not configured in development).',
    };
  }

  const resend = new Resend(apiKey);

  const servicesList = data.services.join(', ');
  const html = `
    <h2>New estimate request    ${siteConfig.name}</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>ZIP:</strong> ${escapeHtml(data.zip)}</p>
    <p><strong>Services:</strong> ${escapeHtml(servicesList)}</p>
    ${data.projectDetails ? `<p><strong>Project details:</strong><br>${escapeHtml(data.projectDetails).replace(/\n/g, '<br>')}</p>` : ''}
    ${data.preferredContactTime ? `<p><strong>Preferred contact time:</strong> ${escapeHtml(data.preferredContactTime)}</p>` : ''}
  `;

  try {
    await resend.emails.send({
      from: 'Star Home Remodeling <onboarding@resend.dev>', // TODO: confirm sender domain
      to: [to],
      subject: `New estimate request from ${data.name}`,
      html,
    });
    return { success: true, message: 'Estimate request sent.' };
  } catch (error) {
    console.error('[sendLead] Failed to send email:', error);
    return { success: false, message: 'We could not send your request. Please call us directly.' };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
