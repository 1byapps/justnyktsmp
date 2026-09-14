import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          imageUrl: p.imageUrl,
          price: p.price,
          discountPrice: p.discountPrice,
          categoryName: p.category.name,
          isVisible: p.isVisible,
          inStock: p.inStock,
        })),
      },
    });
  } catch (error) {
    console.error("Admin products error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
