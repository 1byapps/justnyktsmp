import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.wikiArticle.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
      },
    });

    if (!article || !article.isPublished) {
      return NextResponse.json({ success: false, error: "Makale bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("Public wiki article error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
