import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    // 🔥 NEW Next.js 16 fix — params MUST be awaited
    const { code } = await context.params;

    if (!code) {
      console.error("Code missing in params");
      return new Response("Invalid short URL", { status: 400 });
    }

    // 1. Find link by code
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      console.error("Short code not found:", code);
      return redirect("/");
    }

    // 2. Update click stats
    await prisma.link.update({
      where: { id: link.id },
      data: {
        totalClicks: link.totalClicks + 1,
        lastClickedAt: new Date(),
      },
    });

    // 3. Redirect user
    return redirect(link.targetUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    return new Response("Internal Error", { status: 500 });
  }
}
