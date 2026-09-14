import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(20, parseInt(searchParams.get("pageSize") || "9"));
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (category) {
      where.category = { slug: category };
    }

    const [articles, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: { select: { name: true, slug: true, color: true } },
        },
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: articles.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          summary: a.summary,
          coverImage: a.coverImage,
          category: a.category,
          authorName: a.authorName,
          authorAvatar: a.authorAvatar,
          tags: a.tags,
          publishedAt: a.publishedAt?.toISOString() || a.createdAt.toISOString(),
          createdAt: a.createdAt.toISOString(),
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("News list error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
