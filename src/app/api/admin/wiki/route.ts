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
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const articles = await prisma.wikiArticle.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: articles.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          categoryName: a.category.name,
          isPublished: a.isPublished,
          updatedAt: a.updatedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Admin wiki list error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
