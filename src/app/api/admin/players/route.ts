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

// PATCH: Update player balance or rankName
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }
    const roles = ((session.user as unknown as { roles?: string[] })?.roles || []).map((r) => r.toLowerCase());
    const hasAdmin = roles.some((r) => ['owner', 'admin', 'moderator', 'developer'].includes(r));
    if (!hasAdmin) {
      return NextResponse.json({ success: false, error: "Yetkisiz işlem" }, { status: 403 });
    }

    const body = await request.json();
    const { id, balance, rankName } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Oyuncu ID gerekli" }, { status: 400 });
    }

    const updated = await prisma.minecraftPlayer.update({
      where: { id },
      data: {
        balance: typeof balance === 'number' ? balance : undefined,
        rankName: typeof rankName === 'string' ? rankName : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update player error:", error);
    return NextResponse.json({ success: false, error: "Güncelleme başarısız" }, { status: 500 });
  }
}

// POST: Punish player (BAN, MUTE, UNBAN)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }
    const roles = ((session.user as unknown as { roles?: string[] })?.roles || []).map((r) => r.toLowerCase());
    const hasAdmin = roles.some((r) => ['owner', 'admin', 'moderator', 'developer'].includes(r));
    if (!hasAdmin) {
      return NextResponse.json({ success: false, error: "Yetkisiz işlem" }, { status: 403 });
    }

    const body = await request.json();
    const { playerId, action, type, reason } = body;

    if (action === 'unban') {
      await prisma.punishment.updateMany({
        where: { playerId, isActive: true },
        data: { isActive: false, revokedAt: new Date(), revokedBy: session.user.name || 'Admin' },
      });
      return NextResponse.json({ success: true, message: "Cezalar kaldırıldı" });
    }

    const punishment = await prisma.punishment.create({
      data: {
        playerId,
        staffName: session.user.name || "Admin",
        type: type || "BAN",
        reason: reason || "Yönetici tarafından cezalandırıldı",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: punishment });
  } catch (error) {
    console.error("Punish player error:", error);
    return NextResponse.json({ success: false, error: "Ceza işlemi başarısız" }, { status: 500 });
  }
}
