import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewsStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const article = await prisma.news.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Haber bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("Admin news get error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, slug, summary, content, coverImage, status, tags, seoTitle, seoDescription } = body;

    const dataToUpdate: Record<string, unknown> = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (summary !== undefined) dataToUpdate.summary = summary;
    if (content !== undefined) dataToUpdate.content = content;
    if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;
    if (seoTitle !== undefined) dataToUpdate.seoTitle = seoTitle;
    if (seoDescription !== undefined) dataToUpdate.seoDescription = seoDescription;
    if (tags !== undefined) dataToUpdate.tags = tags;
    if (status !== undefined && Object.values(NewsStatus).includes(status)) {
      dataToUpdate.status = status;
      if (status === "PUBLISHED") {
        dataToUpdate.publishedAt = new Date();
      }
    }

    const updated = await prisma.news.update({
      where: { id },
      data: dataToUpdate,
    });

    await prisma.auditLog.create({
      data: {
        adminName: session.user.name || "Admin",
        action: "NEWS_UPDATE",
        targetType: "NEWS",
        targetId: id,
        details: { title: updated.title },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin news update error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.news.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminName: session.user.name || "Admin",
        action: "NEWS_DELETE",
        targetType: "NEWS",
        targetId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin news delete error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
