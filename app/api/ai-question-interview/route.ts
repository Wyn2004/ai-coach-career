import { db } from "@/configs/db";
import { interviewTable } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "saveQuestionInterview") {
    return await handleSaveQuestionInterview(req);
  }

  return await handleGenerateInterviewQuestions(req);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = user?.primaryEmailAddress?.emailAddress as string;
  try {
    const whereConditions = id
      ? and(eq(interviewTable.id, id), eq(interviewTable.userEmail, userEmail))
      : eq(interviewTable.userEmail, userEmail);
    const response = await db
      .select()
      .from(interviewTable)
      .where(whereConditions);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to get interviews" },
      { status: 500 }
    );
  }
}

export async function handleGenerateInterviewQuestions(req: Request) {
  const formData = await req.formData();
  const { jobPosition, interviewDuration, interviewType, jdFile } =
    Object.fromEntries(formData);

  if (!(jdFile instanceof File)) {
    return NextResponse.json(
      { error: "jdFile must be a File" },
      { status: 400 }
    );
  }

  const loaderJd = new WebPDFLoader(jdFile);
  const docsJd = await loaderJd.load();
  const plainTextJd = docsJd.map((d) => d.pageContent).join("\n");

  const arrayBufferJd = await jdFile.arrayBuffer();
  const base64Jd = Buffer.from(arrayBufferJd).toString("base64");

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const resultIds = await inngest.send({
    name: "AiQuestionInterview",
    data: {
      jobPosition,
      interviewDuration,
      interviewType,
      base64JdFile: base64Jd,
      pdfJdText: plainTextJd,
      userEmail,
    },
  });

  const eventId = resultIds?.ids[0];

  let runStatus;
  while (true) {
    const runs = await getRuns(eventId);
    if (runs[0]?.status === "Completed") {
      runStatus = runs[0]?.output;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return NextResponse.json(runStatus);
}

export async function handleSaveQuestionInterview(req: Request) {
  const payload = await req.json();
  const {
    questionList,
    id,
    job_description,
    question_count,
    total_estimated_duration,
    interview_type,
    role,
  } = payload;

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  await db.insert(interviewTable).values({
    questionList,
    id,
    question_count,
    total_estimated_duration,
    interview_type,
    job_description: job_description,
    role: role,
    userEmail,
  });
  return NextResponse.json({ success: true });
}

export async function getRuns(eventId: string) {
  const response = await fetch(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${eventId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );

  const json = await response.json();
  return json.data;
}
