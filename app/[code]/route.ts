export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    if (!code) {
      return new Response("Invalid short code", { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return redirect("/");
    }

    await prisma.link.update({
      where: { id: link.id },
      data: {
        totalClicks: link.totalClicks + 1,
        lastClickedAt: new Date(),
      },
    });

    return redirect(link.targetUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
