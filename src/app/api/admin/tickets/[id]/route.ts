import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

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

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { username: true, image: true } },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Talep bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error("Admin ticket detail error:", error);
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
    const { status } = await request.json();

    if (!Object.values(TicketStatus).includes(status)) {
      return NextResponse.json({ success: false, error: "Geçersiz durum" }, { status: 400 });
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        status,
        ...(status === "CLOSED" || status === "RESOLVED" ? { closedAt: new Date() } : {}),
      },
    });

    // Log admin audit
    await prisma.auditLog.create({
      data: {
        adminName: session.user.name || session.user.email || "Admin",
        action: "TICKET_STATUS_UPDATE",
        targetType: "TICKET",
        targetId: id,
        details: { newStatus: status },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin ticket update error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
