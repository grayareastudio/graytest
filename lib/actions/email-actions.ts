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
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
<html style="background: #0a0a0a;">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    body { 
      font-family: serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background: #0a0a0a !important; 
      color: #ffffff !important; 
      padding: 20px; 
      line-height: 1.6;
      margin: 0;
    }
    
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #0a0a0a !important;
      color: #ffffff !important;
    }
    
    .header { 
      font-size: 24px; 
      margin-bottom: 8px; 
      color: #ffffff !important; 
      font-weight: 500;
    }
    
    .desc { 
      color: #d4d4d4 !important; 
      margin-bottom: 24px; 
      line-height: 1.5;
    }
    
    .stats { 
      background: #171717 !important; 
      padding: 16px; 
      border-radius: 12px; 
      margin-bottom: 24px; 
      border: 1px solid #333333 !important;
    }
    
    .stats p { 
      margin: 6px 0 !important; 
      color: #ffffff !important; 
      font-size: 15px;
    }
    
    .stats strong { 
      color: #d9d9d9 !important; 
      font-weight: 600;
    }
    
    .btn { 
      display: inline-block; 
      background: #d9d9d9 !important; 
      color: #000000 !important; 
      padding: 12px 24px; 
      border-radius: 9999px; 
      text-decoration: none !important; 
      font-weight: 600; 
      font-size: 15px;
    }
    
    .footer { 
      margin-top: 32px; 
      font-size: 12px; 
      color: #888888 !important; 
      line-height: 1.4;
    }
    
    u + .body { background: #0a0a0a !important; }
    #MessageViewBody, #MessageWebViewDiv { background: #0a0a0a !important; }
  </style>
</head>
<body class="body" style="background: #0a0a0a; color: #ffffff;">
  <div class="container" style="background: #0a0a0a; color: #ffffff;">
    
    <div class="header" style="color: #ffffff;">
      ${payload.artisticTitle || "Your GrayPrint™ Results"}
    </div>
    
    <div class="desc" style="color: #d4d4d4;">
      ${payload.artisticDescription || "View your full report below."}
    </div>
    
    <div class="stats" style="background: #171717; border: 1px solid #333;">
      <p style="color: #ffffff; margin: 6px 0;">
        <strong style="color: #d9d9d9;">Test:</strong> 
        <span style="color: #ffffff;">${payload.testType.toUpperCase()}</span>
      </p>
      <p style="color: #ffffff; margin: 6px 0;">
        <strong style="color: #d9d9d9;">Score:</strong> 
        <span style="color: #ffffff;">${payload.score ?? "—"}</span>
      </p>
      <p style="color: #ffffff; margin: 6px 0;">
        <strong style="color: #d9d9d9;">Percentile:</strong> 
        <span style="color: #ffffff;">${payload.percentile ?? "—"}</span>
      </p>
      <p style="color: #ffffff; margin: 6px 0;">
        <strong style="color: #d9d9d9;">Level:</strong> 
        <span style="color: #ffffff;">${payload.tag ?? "—"}</span>
      </p>
    </div>

    <a href="${baseUrl}/results/${payload.resultId}" class="btn" style="background: #d9d9d9; color: #000000;">
      View Full Report
    </a>
    
    <div class="footer" style="color: #888888;">
      Graytest — For informational purposes only. Not a clinical diagnosis.
    </div>
    
  </div>
</body>
</html>
  `.trim();
}
