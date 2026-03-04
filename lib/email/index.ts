import { Resend } from "resend";
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from "@/lib/email/templates";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Investment Tracker <onboarding@resend.dev>";

function getResend() {
  if (!resendApiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(resendApiKey);
}

export async function sendWelcomeEmail({
  email,
  name,
  intro,
}: WelcomeEmailData): Promise<void> {
  const html = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Welcome to Investment Tracker – your stock toolkit is ready!",
    html,
  });
  if (error) throw new Error(error.message);
}

export async function sendNewsSummaryEmail({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> {
  const html = NEWS_SUMMARY_EMAIL_TEMPLATE.replace("{{date}}", date).replace(
    "{{newsContent}}",
    newsContent
  );
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Market news summary – ${date}`,
    html,
  });
  if (error) throw new Error(error.message);
}

export function hasResend(): boolean {
  return Boolean(resendApiKey);
}
