import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: { news: [], wiki: [], players: [], clans: [] },
      });
    }

    const [news, wiki, players, clans] = await Promise.all([
      prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, slug: true, summary: true },
        take: 5,
      }),
      prisma.wikiArticle.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, slug: true },
        take: 5,
      }),
      prisma.minecraftPlayer.findMany({
        where: {
          username: { contains: q, mode: "insensitive" },
        },
        select: { id: true, username: true, rankName: true, isOnline: true },
        take: 5,
      }),
      prisma.clan.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { tag: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, tag: true, slug: true, level: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        news,
        wiki,
        players,
        clans,
      },
    });
  } catch (error) {
    console.error("Global search error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
