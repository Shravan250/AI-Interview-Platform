// app/api/resume/generate/route.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { role, level, techstack, type, amount, userid } =
    await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview based on a candidate's resume.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        
        Since these questions are tailored to a resume, make them specific and probing —
        focus on the candidate's likely real experience with the listed technologies.
        
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = {
      role,
      type,
      level,
      techstack: Array.isArray(techstack) ? techstack : techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      source: "resume", // mark as resume-generated for reference
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, interviewId: docRef.id },
      { status: 200 }
    );
  } catch (e) {
    console.error("Resume generate error:", e);
    return Response.json({ success: false }, { status: 500 });
  }
}
