import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { tag: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const clans = await prisma.clan.findMany({
      where,
      orderBy: { score: "desc" },
      include: {
        _count: {
          select: { members: true },
        },
        members: {
          where: { role: "OWNER" },
          include: { player: { select: { username: true } } },
          take: 1,
        },
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: {
        items: clans.map((c, i) => ({
          rank: i + 1,
          id: c.id,
          name: c.name,
          tag: c.tag,
          slug: c.slug,
          level: c.level,
          score: c.score,
          balance: c.balance,
          memberCount: c._count.members,
          ownerName: c.members[0]?.player.username || "Bilinmiyor",
        })),
      },
    });
  } catch (error) {
    console.error("Public clans fetch error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
