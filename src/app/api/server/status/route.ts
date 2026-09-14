import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import net from "net";

function probeTcp(host: string, port: number, timeout = 2500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

export async function GET() {
  const SERVER_HOST = "schmidt-scanners.tun.ply.gg";
  const SERVER_PORT = 64110;
  const BEDROCK_PORT = 19132;
  const MAX_PLAYERS = 20;
  const VERSION_STR = "1.8 - 1.21.x (Java & Bedrock)";
  const MOTD_STR = "JustNykt SMP | 1.8 - 1.21.x [Hayatta Kalma]";

  let isOnline = false;
  let onlinePlayers = 0;

  try {
    // 1. Check JustNyktSync heartbeat from Neon DB
    const heartbeatSetting = await prisma.setting.findUnique({
      where: { key: "last_server_heartbeat" },
    });

    if (heartbeatSetting && heartbeatSetting.value) {
      const lastHeartbeat = Number(heartbeatSetting.value);
      if (!isNaN(lastHeartbeat) && Date.now() - lastHeartbeat < 120_000) {
        isOnline = true;
      }
    }

    // If online via heartbeat, get real online player count
    if (isOnline) {
      onlinePlayers = await prisma.minecraftPlayer.count({
        where: { isOnline: true },
      });
    } else {
      // 2. Fallback: Check TCP port directly
      const tcpReachable = await probeTcp(SERVER_HOST, SERVER_PORT, 2000);
      if (tcpReachable) {
        isOnline = true;
      } else {
        // Try third-party checker
        try {
          const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_HOST}:${SERVER_PORT}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.online) {
              isOnline = true;
              onlinePlayers = data.players?.online || 0;
            }
          }
        } catch {
          // ignore
        }
      }
    }
  } catch (err) {
    console.error("Status route error:", err);
  }

  return NextResponse.json({
    success: true,
    data: {
      online: isOnline,
      players: {
        online: onlinePlayers,
        max: MAX_PLAYERS,
      },
      version: VERSION_STR,
      motd: MOTD_STR,
      ip: `${SERVER_HOST}:${SERVER_PORT}`,
      javaIp: `${SERVER_HOST}:${SERVER_PORT}`,
      bedrockIp: SERVER_HOST,
      bedrockPort: BEDROCK_PORT,
    },
  });
}
