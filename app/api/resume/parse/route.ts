// app/api/resume/parse/route.ts
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const resumeSchema = z.object({
  role: z.string().describe("The most suitable job role based on the resume"),
  level: z
    .enum(["Junior", "Mid", "Senior", "Lead", "Principal"])
    .describe("Experience level inferred from years of experience and seniority"),
  techstack: z
    .array(z.string())
    .describe("List of technologies, frameworks, and tools found in the resume"),
  type: z
    .enum(["Technical", "Behavioral", "Mixed"])
    .describe("Recommended interview type based on the role"),
  amount: z
    .number()
    .min(3)
    .max(15)
    .describe("Recommended number of interview questions (between 5 and 10)"),
  summary: z
    .string()
    .describe(
      "A 2-3 sentence summary of the candidate's background and key strengths"
    ),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return Response.json(
        { success: false, error: "No resume file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { success: false, error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash", {
        structuredOutputs: false,
      }),
      schema: resumeSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              data: base64,
              mimeType: "application/pdf",
            },
            {
              type: "text",
              text: `Analyze this resume carefully and extract structured information for generating a technical interview.
              
              Instructions:
              - Identify the primary job role this candidate is best suited for based on their experience
              - Determine their seniority level from years of experience, job titles, and responsibilities
              - Extract ALL technologies, frameworks, languages, and tools they have experience with
              - Recommend whether the interview should be Technical, Behavioral, or Mixed based on their role
              - Suggest an appropriate number of interview questions (between 5-10)
              - Write a brief summary of their background
              
              Be accurate and specific. Only include technologies you can clearly identify from the resume.`,
            },
          ],
        },
      ],
    });

    return Response.json({ success: true, data: object }, { status: 200 });
  } catch (error) {
    console.error("Resume parse error:", error);
    return Response.json(
      { success: false, error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
