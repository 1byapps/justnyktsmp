import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { username: true, image: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Talep bulunamadı" }, { status: 404 });
    }

    // Ensure the ticket belongs to the user or user is staff
    const isOwner = ticket.userId === session.user.id;
    const roles = (session.user as unknown as { roles?: string[] })?.roles || [];
    const isStaff = roles.some((r) => ["owner", "admin", "moderator", "support"].includes(r.toLowerCase()));

    if (!isOwner && !isStaff) {
      return NextResponse.json({ success: false, error: "Bu talebe erişim yetkiniz yok" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error("Ticket detail error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
