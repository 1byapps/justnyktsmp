import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { items, mcUsername, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Sepetiniz boş." }, { status: 400 });
    }

    if (!mcUsername || typeof mcUsername !== "string" || !mcUsername.trim()) {
      return NextResponse.json({ success: false, error: "Lütfen geçerli bir Minecraft kullanıcı adı girin." }, { status: 400 });
    }

    const cleanUsername = mcUsername.trim();

    // Determine associated User ID
    let userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      // Find matching user by username, or fallback to first user (admin)
      const user = await prisma.user.findFirst({
        where: { username: { equals: cleanUsername, mode: "insensitive" } },
      });
      if (user) {
        userId = user.id;
      } else {
        const defaultUser = await prisma.user.findFirst();
        userId = defaultUser?.id || "anonymous";
      }
    }

    // Calculate prices & verify items
    let subtotal = 0;
    const orderItemsData: Array<{ productId: string; quantity: number; unitPrice: number; total: number }> = [];

    for (const item of items) {
      // Try to find product by id or slug
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: item.id }, { slug: item.id }, { slug: item.slug }],
        },
      });

      if (!product) continue;

      const price = product.discountPrice ?? product.price;
      const qty = Math.max(1, Number(item.quantity) || 1);
      const lineTotal = price * qty;

      subtotal += lineTotal;
      orderItemsData.push({
        productId: product.id,
        quantity: qty,
        unitPrice: price,
        total: lineTotal,
      });
    }

    if (orderItemsData.length === 0) {
      return NextResponse.json({ success: false, error: "Geçerli ürün bulunamadı." }, { status: 400 });
    }

    let discount = 0;
    let couponId: string | undefined = undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        couponId = coupon.id;
        if (coupon.discountType === "PERCENTAGE") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = Math.min(subtotal, coupon.discountValue);
        }
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Create Order with status PAID so JustNyktSync delivers commands in game
    const order = await prisma.order.create({
      data: {
        userId,
        mcUsername: cleanUsername,
        subtotal,
        discount,
        total,
        status: "PAID",
        couponId,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        total: order.total,
        mcUsername: cleanUsername,
        message: "Siparişiniz başarıyla alındı ve Minecraft sunucusuna teslimat komutu iletildi!",
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: "Sipariş oluşturulamadı." }, { status: 500 });
  }
}
