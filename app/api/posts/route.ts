import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }
    const { user } = session;

    const json = await req.json();
    const body = postCreateSchema.parse(json);
    const { title, content } = body;

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
      select: {
        id: true,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }
    return NextResponse.json(null, { status: 500 });
  }
}
