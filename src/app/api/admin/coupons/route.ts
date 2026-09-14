import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: coupons.map((c) => ({
          id: c.id,
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          usageCount: c.usageCount,
          usageLimit: c.usageLimit,
          isActive: c.isActive,
          startsAt: c.startsAt ? c.startsAt.toISOString() : null,
          expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
        })),
      },
    });
  } catch (error) {
    console.error("Admin coupons error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
