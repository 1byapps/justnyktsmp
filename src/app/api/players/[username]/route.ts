import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const player = await prisma.minecraftPlayer.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      include: {
        clanMember: {
          include: {
            clan: { select: { id: true, name: true, tag: true, slug: true } },
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: "Oyuncu bulunamadı" },
        { status: 404 }
      );
    }

    const profile = {
      id: player.id,
      uuid: player.uuid,
      username: player.username,
      rankName: player.rankName,
      balance: player.balance,
      playtimeMinutes: player.playtimeMinutes,
      kills: player.kills,
      deaths: player.deaths,
      level: player.level,
      experience: player.experience,
      questsCompleted: player.questsCompleted,
      blocksBroken: Number(player.blocksBroken),
      fishCaught: player.fishCaught,
      firstJoinAt: player.firstJoinAt.toISOString(),
      lastSeenAt: player.lastSeenAt.toISOString(),
      isOnline: player.isOnline,
      clan: player.clanMember
        ? {
            id: player.clanMember.clan.id,
            name: player.clanMember.clan.name,
            tag: player.clanMember.clan.tag,
            slug: player.clanMember.clan.slug,
            role: player.clanMember.role,
          }
        : null,
    };

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Player fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
