import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewsStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: news.map((n) => ({
          id: n.id,
          title: n.title,
          slug: n.slug,
          status: n.status,
          categoryName: n.category.name,
          authorName: n.authorName,
          publishedAt: n.publishedAt ? n.publishedAt.toISOString() : null,
          createdAt: n.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Admin news list error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, summary, content, coverImage, categoryId, authorName, status, tags, seoTitle, seoDescription } = body;

    // Find category or fallback to first
    let category = await prisma.newsCategory.findFirst({
      where: { OR: [{ id: categoryId }, { slug: categoryId }] },
    });

    if (!category) {
      category = await prisma.newsCategory.findFirst();
    }

    if (!category) {
      category = await prisma.newsCategory.create({
        data: { name: "Genel", slug: "genel", color: "#10b981" },
      });
    }

    const finalStatus = Object.values(NewsStatus).includes(status) ? (status as NewsStatus) : NewsStatus.DRAFT;

    const article = await prisma.news.create({
      data: {
        title: title || "Başlıksız Haber",
        slug: slug || `haber-${Date.now()}`,
        summary: summary || "",
        content: content || "",
        coverImage: coverImage || null,
        categoryId: category.id,
        authorName: authorName || session.user.name || "Admin",
        status: finalStatus,
        tags: Array.isArray(tags) ? tags : [],
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        publishedAt: finalStatus === NewsStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Log admin audit
    await prisma.auditLog.create({
      data: {
        adminName: session.user.name || "Admin",
        action: "NEWS_CREATE",
        targetType: "NEWS",
        targetId: article.id,
        details: { title: article.title },
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("Admin create news error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
