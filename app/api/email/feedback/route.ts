// app/api/email/feedback/route.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT = "hireiq.main@gmail.com";

function buildEmailHtml(params: {
  userName: string;
  role: string;
  interviewType: string;
  createdAt: string;
  totalScore: number;
  categoryScores: { name: string; score: number; comment: string }[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  interviewId: string;
}) {
  const {
    userName,
    role,
    interviewType,
    createdAt,
    totalScore,
    categoryScores,
    strengths,
    areasForImprovement,
    finalAssessment,
    interviewId,
  } = params;

  const scoreColor =
    totalScore >= 75 ? "#4ade80" : totalScore >= 50 ? "#facc15" : "#f87171";

  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const categoryRows = categoryScores
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 12px;font-size:14px;color:#d1d5db;border-bottom:1px solid #374151;">${c.name}</td>
        <td style="padding:10px 12px;font-size:14px;font-weight:700;color:${
          c.score >= 75 ? "#4ade80" : c.score >= 50 ? "#facc15" : "#f87171"
        };border-bottom:1px solid #374151;text-align:center;">${c.score}/100</td>
        <td style="padding:10px 12px;font-size:13px;color:#9ca3af;border-bottom:1px solid #374151;">${c.comment}</td>
      </tr>`
    )
    .join("");

  const strengthItems = strengths
    .map(
      (s) =>
        `<li style="padding:4px 0;font-size:14px;color:#d1d5db;">✦ ${s}</li>`
    )
    .join("");

  const improvementItems = areasForImprovement
    .map(
      (a) =>
        `<li style="padding:4px 0;font-size:14px;color:#d1d5db;">→ ${a}</li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>HireIQ Interview Feedback Report</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1117;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1f2e 0%,#0f1117 100%);border:1px solid #1e2535;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#6b7280;">HireIQ</p>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;">Interview Feedback Report</h1>
              <p style="margin:12px 0 0;font-size:14px;color:#9ca3af;">${date}</p>
            </td>
          </tr>

          <!-- Score banner -->
          <tr>
            <td style="background:#13182a;border-left:1px solid #1e2535;border-right:1px solid #1e2535;padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Candidate</p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">${userName}</p>
                  </td>
                  <td style="text-align:center;">
                    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Role</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;text-transform:capitalize;">${role}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${interviewType}</p>
                  </td>
                  <td style="text-align:right;">
                    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Overall Score</p>
                    <p style="margin:0;font-size:36px;font-weight:800;color:${scoreColor};">${totalScore}<span style="font-size:16px;color:#6b7280;">/100</span></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Final assessment -->
          <tr>
            <td style="background:#0f1117;border-left:1px solid #1e2535;border-right:1px solid #1e2535;padding:28px 40px 0;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Final Assessment</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#d1d5db;background:#13182a;border-left:3px solid #6366f1;padding:16px 20px;border-radius:0 8px 8px 0;">${finalAssessment}</p>
            </td>
          </tr>

          <!-- Category breakdown -->
          <tr>
            <td style="background:#0f1117;border-left:1px solid #1e2535;border-right:1px solid #1e2535;padding:28px 40px 0;">
              <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Score Breakdown</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e2535;border-radius:10px;overflow:hidden;">
                <thead>
                  <tr style="background:#13182a;">
                    <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Category</th>
                    <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Score</th>
                    <th style="padding:10px 12px;font-size:12px;color:#6b7280;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Comment</th>
                  </tr>
                </thead>
                <tbody>${categoryRows}</tbody>
              </table>
            </td>
          </tr>

          <!-- Strengths -->
          <tr>
            <td style="background:#0f1117;border-left:1px solid #1e2535;border-right:1px solid #1e2535;padding:28px 40px 0;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Strengths</p>
              <ul style="margin:0;padding:0;list-style:none;background:#13182a;border:1px solid #1e2535;border-radius:10px;padding:16px 20px;">
                ${strengthItems}
              </ul>
            </td>
          </tr>

          <!-- Areas for improvement -->
          <tr>
            <td style="background:#0f1117;border-left:1px solid #1e2535;border-right:1px solid #1e2535;padding:28px 40px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Areas for Improvement</p>
              <ul style="margin:0;padding:0;list-style:none;background:#13182a;border:1px solid #1e2535;border-radius:10px;padding:16px 20px;">
                ${improvementItems}
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#13182a;border:1px solid #1e2535;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Interview ID: <span style="color:#9ca3af;font-family:monospace;">${interviewId}</span></p>
              <p style="margin:0;font-size:12px;color:#4b5563;">Generated by HireIQ · AI-Powered Interview Practice</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userName,
      role,
      interviewType,
      createdAt,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      interviewId,
    } = body;

    if (!interviewId || !userName) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const html = buildEmailHtml({
      userName,
      role,
      interviewType,
      createdAt,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      interviewId,
    });

    const { data, error } = await resend.emails.send({
      from: "HireIQ <onboarding@resend.dev>", // replace with your verified domain later
      to: [RECIPIENT],
      subject: `Interview Feedback — ${role} (${totalScore}/100) · ${userName}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ success: false, error }, { status: 500 });
    }

    return Response.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Email route error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
