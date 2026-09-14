import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = [
  "balance", "playtime", "kills", "deaths", "kd", "quests", "level", "blocks", "fish",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

function getOrderByField(category: Category) {
  const map: Record<Category, string> = {
    balance: "balance",
    playtime: "playtimeMinutes",
    kills: "kills",
    deaths: "deaths",
    kd: "kills",
    quests: "questsCompleted",
    level: "level",
    blocks: "blocksBroken",
    fish: "fishCaught",
  };
  return map[category];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get("category") || "balance") as Category;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(10, parseInt(searchParams.get("pageSize") || "20")));
    const search = searchParams.get("search") || "";

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz kategori" },
        { status: 400 }
      );
    }

    const where = search
      ? { username: { contains: search, mode: "insensitive" as const } }
      : {};

    const orderByField = getOrderByField(category);

    const [players, total] = await Promise.all([
      prisma.minecraftPlayer.findMany({
        where,
        orderBy: { [orderByField]: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          clanMember: {
            include: {
              clan: { select: { name: true, tag: true } },
            },
          },
        },
      }),
      prisma.minecraftPlayer.count({ where }),
    ]);

    const entries = players.map((p, i) => {
      let value: number | string;
      if (category === "kd") {
        value = p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : p.kills.toString();
      } else {
        const field = orderByField as keyof typeof p;
        value = Number(p[field]);
      }

      return {
        rank: (page - 1) * pageSize + i + 1,
        username: p.username,
        uuid: p.uuid,
        value,
        clan: p.clanMember?.clan?.tag || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: entries,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
