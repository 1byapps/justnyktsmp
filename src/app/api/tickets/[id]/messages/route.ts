import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1, "Mesaj boş olamaz").max(2000, "Mesaj çok uzun"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];
      return NextResponse.json({ success: false, error: issue?.message || "Geçersiz veri" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Talep bulunamadı" }, { status: 404 });
    }

    const isOwner = ticket.userId === session.user.id;
    const roles = (session.user as unknown as { roles?: string[] })?.roles || [];
    const isStaff = roles.some((r) => ["owner", "admin", "moderator", "support"].includes(r.toLowerCase()));

    if (!isOwner && !isStaff) {
      return NextResponse.json({ success: false, error: "Yetkiniz yok" }, { status: 403 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        userId: session.user.id,
        content: parsed.data.content,
        isStaffReply: isStaff && !isOwner,
      },
    });

    // Update ticket status
    await prisma.ticket.update({
      where: { id },
      data: {
        status: isStaff ? "WAITING_USER" : "IN_REVIEW",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Add ticket message error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
