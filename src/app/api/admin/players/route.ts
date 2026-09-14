import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(10, parseInt(searchParams.get("pageSize") || "20")));

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { uuid: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [players, total] = await Promise.all([
      prisma.minecraftPlayer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { lastSeenAt: "desc" },
        include: {
          punishments: {
            where: { isActive: true },
            take: 1,
          },
        },
      }),
      prisma.minecraftPlayer.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: players.map((p) => ({
          id: p.id,
          uuid: p.uuid,
          username: p.username,
          rankName: p.rankName,
          balance: p.balance,
          playtimeMinutes: p.playtimeMinutes,
          lastSeenAt: p.lastSeenAt.toISOString(),
          isOnline: p.isOnline,
          hasPunishment: p.punishments.length > 0,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Admin players API error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
