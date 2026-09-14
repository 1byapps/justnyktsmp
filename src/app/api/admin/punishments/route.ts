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
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};
    if (filter === "active") where.isActive = true;
    if (filter === "expired") where.isActive = false;
    if (search) {
      where.player = {
        username: { contains: search, mode: "insensitive" },
      };
    }

    const punishments = await prisma.punishment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        player: { select: { username: true, uuid: true } },
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: {
        items: punishments.map((p) => ({
          id: p.id,
          playerName: p.player.username,
          playerUuid: p.player.uuid,
          type: p.type,
          reason: p.reason,
          staffName: p.staffName,
          isActive: p.isActive,
          expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
          createdAt: p.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Admin punishments error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
