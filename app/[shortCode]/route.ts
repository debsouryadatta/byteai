import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  const url = await db.url.findUnique({
    where: { shortCode: params.shortCode },
  });

  if (!url) {
    return new Response("Not Found", { status: 404 });
  }

  await db.url.update({
    where: { id: url.id },
    data: { clicks: { increment: 1 } },
  });

  redirect(url.originalUrl);
}
