import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In production, ping the actual Minecraft server
    // For now, return API-ready structure
    const status = {
      online: true,
      players: {
        online: 0,
        max: 500,
      },
      version: "1.21.x",
      motd: "JustNyktSMP - Modern SMP Deneyimi",
    };

    return NextResponse.json({ success: true, data: status });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        online: false,
        players: { online: 0, max: 0 },
        version: "1.21.x",
        motd: "",
      },
    });
  }
}
