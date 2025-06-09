import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import { AiAgentType } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const { recordId, analysisType, cvFile, jdFile, describeRole } =
    Object.fromEntries(formData);

  if (!(cvFile instanceof File)) {
    return NextResponse.json(
      { error: "cvFile must be a File" },
      { status: 400 }
    );
  }

  if (!(jdFile instanceof File)) {
    return NextResponse.json(
      { error: "jdFile must be a File" },
      { status: 400 }
    );
  }

  const loaderCv = new WebPDFLoader(cvFile);
  const docsCv = await loaderCv.load();
  const plainTextCv = docsCv.map((d) => d.pageContent).join("\n");

  const arrayBufferCv = await cvFile.arrayBuffer();
  const base64Cv = Buffer.from(arrayBufferCv).toString("base64");

  const loaderJd = new WebPDFLoader(jdFile);
  const docsJd = await loaderJd.load();
  const plainTextJd = docsJd.map((d) => d.pageContent).join("\n");

  const arrayBufferJd = await jdFile.arrayBuffer();
  const base64Jd = Buffer.from(arrayBufferJd).toString("base64");

  const aiAgentType =
    analysisType === "role"
      ? AiAgentType.AI_RESUME_ANALYSIS_ROLE
      : AiAgentType.AI_RESUME_ANALYSIS_JD;

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const resultIds = await inngest.send({
    name: "AiResumeAnalysisAgent",
    data: {
      recordId,
      base64CvFile: base64Cv,
      pdfCvText: plainTextCv,
      base64JdFile: base64Jd,
      pdfJdText: plainTextJd,
      analysisType,
      describeRole,
      aiAgentType,
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

  return NextResponse.json(runStatus?.output[0]);
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
