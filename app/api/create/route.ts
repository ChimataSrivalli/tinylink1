import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const { targetUrl } = await req.json();

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Missing targetUrl" },
        { status: 400 }
      );
    }

    const code = Math.random().toString(36).substring(2, 8);

    const link = await prisma.link.create({
      data: { code, targetUrl },
    });

    return NextResponse.json({
      code: link.code,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
