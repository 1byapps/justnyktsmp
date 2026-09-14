import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.news.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        category: { select: { name: true, slug: true, color: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Haber bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        coverImage: article.coverImage,
        category: article.category,
        authorName: article.authorName,
        authorAvatar: article.authorAvatar,
        tags: article.tags,
        publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
        createdAt: article.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("News article error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
