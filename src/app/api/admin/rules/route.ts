import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const rules = await prisma.rule.findMany({
      orderBy: [{ category: { sortOrder: "asc" } }, { ruleNumber: "asc" }],
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: rules.map((r) => ({
          id: r.id,
          ruleNumber: r.ruleNumber,
          title: r.title,
          content: r.content,
          categoryName: r.category.name,
          isActive: r.isActive,
        })),
      },
    });
  } catch (error) {
    console.error("Admin rules list error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
