import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.mcsrvstat.us/3/schmidt-scanners.tun.ply.gg", {
      next: { revalidate: 30 },
    });
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        data: {
          online: Boolean(data.online),
          players: {
            online: data.players?.online || 0,
            max: data.players?.max || 100,
          },
          version: "1.21.4 (Tüm Sürümler)",
          motd: data.motd?.clean?.join(" ") || "JustNyktSMP - Modern SMP Sunucusu",
          ip: "schmidt-scanners.tun.ply.gg",
        },
      });
    }

    throw new Error("MCSrvStat fetch failed");
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        online: true,
        players: { online: 0, max: 100 },
        version: "1.21.4 (Tüm Sürümler)",
        motd: "JustNyktSMP - Normal SMP",
        ip: "schmidt-scanners.tun.ply.gg",
      },
    });
  }
}
