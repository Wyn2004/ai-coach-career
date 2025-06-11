import { db } from "@/configs/db";
import { questionInterviewTable } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "saveQuestionInterview") {
    return await handleSaveQuestionInterview(req);
  }

  return await handleGenerateInterviewQuestions(req);
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
  const { questionList, id, job_descriptions } = payload;

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  await db.insert(questionInterviewTable).values({
    questionList,
    id,
    jobDescription: job_descriptions,
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
