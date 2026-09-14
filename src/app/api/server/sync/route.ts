import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYNC_API_KEY = process.env.SERVER_SYNC_KEY || "nykt_sync_secret_key_2026";

async function recordServerHeartbeat() {
  try {
    await prisma.setting.upsert({
      where: { key: "last_server_heartbeat" },
      create: { key: "last_server_heartbeat", value: Date.now().toString() },
      update: { value: Date.now().toString() },
    });
  } catch (e) {
    console.error("Failed to record server heartbeat:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("X-API-Key") || request.headers.get("Authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (apiKey !== SYNC_API_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Geçersiz API Anahtarı" }, { status: 401 });
    }

    await recordServerHeartbeat();

    const body = await request.json();
    const { action, player, players } = body;

    // 1. Single player join/quit or update
    if (action === "player_update" && player) {
      await prisma.minecraftPlayer.upsert({
        where: { uuid: player.uuid },
        create: {
          uuid: player.uuid,
          username: player.username,
          isOnline: Boolean(player.isOnline),
          playtimeMinutes: player.playtimeMinutes || 0,
          kills: player.kills || 0,
          deaths: player.deaths || 0,
          level: player.level || 1,
          balance: player.balance || 0,
          lastSeenAt: new Date(),
        },
        update: {
          username: player.username,
          isOnline: Boolean(player.isOnline),
          playtimeMinutes: player.playtimeMinutes !== undefined ? player.playtimeMinutes : undefined,
          kills: player.kills !== undefined ? player.kills : undefined,
          deaths: player.deaths !== undefined ? player.deaths : undefined,
          level: player.level !== undefined ? player.level : undefined,
          balance: player.balance !== undefined ? player.balance : undefined,
          lastSeenAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: "Oyuncu eşitlendi" });
    }

    // 2. Bulk sync for all online players
    if (action === "sync_all" && Array.isArray(players)) {
      for (const p of players) {
        await prisma.minecraftPlayer.upsert({
          where: { uuid: p.uuid },
          create: {
            uuid: p.uuid,
            username: p.username,
            isOnline: true,
            playtimeMinutes: p.playtimeMinutes || 0,
            kills: p.kills || 0,
            deaths: p.deaths || 0,
            level: p.level || 1,
            balance: p.balance || 0,
            lastSeenAt: new Date(),
          },
          update: {
            username: p.username,
            isOnline: true,
            playtimeMinutes: p.playtimeMinutes !== undefined ? p.playtimeMinutes : undefined,
            kills: p.kills !== undefined ? p.kills : undefined,
            deaths: p.deaths !== undefined ? p.deaths : undefined,
            level: p.level !== undefined ? p.level : undefined,
            balance: p.balance !== undefined ? p.balance : undefined,
            lastSeenAt: new Date(),
          },
        });
      }
      return NextResponse.json({ success: true, count: players.length });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" }, { status: 400 });
  } catch (error) {
    console.error("Server sync error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// GET: The Minecraft plugin polls this to fetch pending commands (market purchases, unbans, etc.)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("X-API-Key") || request.headers.get("Authorization");
    const apiKey = authHeader?.replace("Bearer ", "") || request.nextUrl.searchParams.get("key");

    if (apiKey !== SYNC_API_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Geçersiz API Anahtarı" }, { status: 401 });
    }

    await recordServerHeartbeat();

    // Find paid orders not yet marked as delivered
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PAID",
      },
      include: {
        items: {
          include: { product: true },
        },
      },
      take: 10,
    });

    const commands: Array<{ id: string; command: string; orderId: string }> = [];

    for (const order of pendingOrders) {
      const targetUser = order.mcUsername || "Player";
      for (const item of order.items) {
        // Generate command based on category or product name
        const prodName = item.product.name.toLowerCase();
        if (prodName.includes("vip+")) {
          commands.push({ id: `${order.id}_${item.id}`, command: `lp user ${targetUser} parent add vip+`, orderId: order.id });
        } else if (prodName.includes("vip")) {
          commands.push({ id: `${order.id}_${item.id}`, command: `lp user ${targetUser} parent add vip`, orderId: order.id });
        } else if (prodName.includes("kasa") || prodName.includes("anahtar")) {
          commands.push({ id: `${order.id}_${item.id}`, command: `crate key give ${targetUser} normal 1`, orderId: order.id });
        } else {
          commands.push({ id: `${order.id}_${item.id}`, command: `tellraw ${targetUser} {"text":"[Market] Satın alımınız teslim edildi!","color":"green"}`, orderId: order.id });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        commands,
      },
    });
  } catch (error) {
    console.error("Fetch pending commands error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PATCH: The Minecraft plugin acknowledges that a command was executed
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("X-API-Key") || request.headers.get("Authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (apiKey !== SYNC_API_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Geçersiz API Anahtarı" }, { status: 401 });
    }

    await recordServerHeartbeat();

    const { orderId } = await request.json();
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "DELIVERED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Acknowledge command error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
