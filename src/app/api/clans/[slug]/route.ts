import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const clan = await prisma.clan.findFirst({
      where: {
        OR: [
          { slug: slug.toLowerCase() },
          { tag: { equals: slug, mode: "insensitive" } },
        ],
      },
      include: {
        members: {
          include: {
            player: {
              select: {
                uuid: true,
                username: true,
                level: true,
                isOnline: true,
                playtimeMinutes: true,
              },
            },
          },
          orderBy: { role: "asc" },
        },
      },
    });

    if (!clan) {
      return NextResponse.json({ success: false, error: "Klan bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: clan });
  } catch (error) {
    console.error("Public clan detail fetch error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
