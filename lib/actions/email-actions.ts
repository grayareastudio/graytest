// lib/actions/email-actions.ts
"use server";

import nodemailer from "nodemailer";

export interface TestResultEmailPayload {
  to: string;
  testType: string;
  score: number | null;
  percentile: string | null;
  tag: string | null;
  resultId: string;
  artisticTitle?: string | null;
  artisticDescription?: string | null;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

export async function sendTestResultEmail(payload: TestResultEmailPayload) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Graytest <noreply@graytest.app>",
      to: payload.to,
      subject: `Your GrayPrint™ Results: ${payload.artisticTitle || "Ready"}`,
      text: generatePlainTextEmail(payload),
      html: generateHtmlEmail(payload),
    });

    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown",
    };
  }
}

function generatePlainTextEmail(payload: TestResultEmailPayload): string {
  const baseUrl = getBaseUrl();
  return `
Your Graytest Results Are Ready

Test: ${payload.testType.toUpperCase()}
Score: ${payload.score ?? "—"}
Percentile: ${payload.percentile ?? "—"}
Level: ${payload.tag ?? "—"}

${payload.artisticDescription || "View your full GrayPrint™ report below."}

🔗 View Full Results: ${baseUrl}/results/${payload.resultId}

---
Graytest — For informational purposes only. Not a clinical diagnosis.
  `.trim();
}

function generateHtmlEmail(payload: TestResultEmailPayload): string {
  const baseUrl = getBaseUrl();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: serif; background: #0a0a0a; color: #fff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { font-size: 24px; margin-bottom: 8px; }
    .desc { color: #a1a1a1; margin-bottom: 24px; }
    .stats { background: #171717; padding: 16px; border-radius: 12px; margin-bottom: 24px; }
    .stats p { margin: 4px 0; }
    .btn { display: inline-block; background: #d9d9d9; color: #000; padding: 12px 24px; 
           border-radius: 9999px; text-decoration: none; font-weight: 500; }
    .footer { margin-top: 32px; font-size: 12px; color: #6b6b6b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">${payload.artisticTitle || "Your GrayPrint™ Results"}</div>
    <div class="desc">${payload.artisticDescription || "View your full report below."}</div>
    
    <div class="stats">
      <p><strong>Test:</strong> ${payload.testType.toUpperCase()}</p>
      <p><strong>Score:</strong> ${payload.score ?? "—"}</p>
      <p><strong>Percentile:</strong> ${payload.percentile ?? "—"}</p>
      <p><strong>Level:</strong> ${payload.tag ?? "—"}</p>
    </div>

    <a href="${baseUrl}/results/${payload.resultId}" class="btn">View Full Report</a>
    
    <div class="footer">
      Graytest — For informational purposes only. Not a clinical diagnosis.
    </div>
  </div>
</body>
</html>
  `.trim();
}
