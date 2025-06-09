import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { userInput, messages } = await req.json();

  const resultIds = await inngest.send({
    name: "AiCoachAgent",
    data: {
      userInput,
      messages,
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
