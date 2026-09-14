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
    const status = searchParams.get("status") || "all";

    const where: Record<string, unknown> = {};
    if (status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
        _count: { select: { items: true } },
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: {
        items: orders.map((o) => ({
          id: o.id,
          username: o.user.username,
          mcUsername: o.mcUsername || o.user.username,
          itemCount: o._count.items,
          total: o.total,
          status: o.status,
          paymentStatus: o.status === "PAID" ? "COMPLETED" : "PENDING",
          createdAt: o.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
