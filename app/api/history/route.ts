import { db } from "@/configs/db";
import { historyTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, recordId } = await req.json();
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const history = await db.insert(historyTable).values({
      content,
      recordId,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: new Date(),
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create history" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { content, recordId } = await req.json();
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await db
      .update(historyTable)
      .set({
        content,
      })
      .where(eq(historyTable.recordId, recordId));

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update history" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get("recordId");
  if (!recordId) {
    return NextResponse.json(
      { error: "Record ID is required" },
      { status: 400 }
    );
  }
  try {
    const history = await db
      .select()
      .from(historyTable)
      .where(eq(historyTable.recordId, recordId));

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to get history" },
      { status: 500 }
    );
  }
}
