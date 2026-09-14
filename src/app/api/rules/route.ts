import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.ruleCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        rules: {
          where: { isActive: true },
          orderBy: { ruleNumber: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Public rules fetch error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
