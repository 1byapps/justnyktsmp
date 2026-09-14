import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ success: false, error: "Mesaj boş olamaz" }, { status: 400 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        userId: session.user.id,
        content: content.trim(),
        isStaffReply: true,
      },
    });

    await prisma.ticket.update({
      where: { id },
      data: {
        status: "WAITING_USER",
        updatedAt: new Date(),
      },
    });

    // Create user notification
    const ticket = await prisma.ticket.findUnique({ where: { id }, select: { userId: true, subject: true } });
    if (ticket) {
      await prisma.notification.create({
        data: {
          userId: ticket.userId,
          type: "TICKET_REPLY",
          title: "Destek Talebiniz Yanıtlandı",
          message: `"${ticket.subject}" başlıklı destek talebinize yetkili tarafından yanıt verildi.`,
          link: `/destek/${id}`,
        },
      });
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Admin ticket reply error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
