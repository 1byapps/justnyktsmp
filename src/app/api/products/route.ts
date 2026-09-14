import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {
      isVisible: true,
    };

    if (category && category !== "Tümü") {
      where.category = {
        name: { equals: category, mode: "insensitive" },
      };
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.productCategory.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          desc: p.description,
          shortDescription: p.shortDescription,
          price: p.price,
          discountPrice: p.discountPrice,
          category: p.category.name,
          imageUrl: p.imageUrl,
          inStock: p.inStock,
        })),
        categories: ["Tümü", ...categories.map((c) => c.name)],
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
