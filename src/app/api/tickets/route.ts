import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TicketCategory } from '@prisma/client';
import { z } from 'zod';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error('Tickets fetch error:', error);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

const createTicketSchema = z.object({
  subject: z.string().min(3, 'Konu en az 3 karakter olmalıdır'),
  category: z.string(),
  content: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  mcUsername: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const body = await req.json();
    const parsed = createTicketSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];
      return NextResponse.json({ success: false, error: issue?.message || 'Geçersiz veri' }, { status: 400 });
    }

    const validCategory = Object.values(TicketCategory).includes(parsed.data.category as TicketCategory)
      ? (parsed.data.category as TicketCategory)
      : TicketCategory.OTHER;

    const ticket = await prisma.ticket.create({
      data: {
        subject: parsed.data.subject,
        category: validCategory,
        status: 'OPEN',
        userId: session.user.id,
        mcUsername: parsed.data.mcUsername || null,
        messages: {
          create: {
            content: parsed.data.content,
            userId: session.user.id,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Ticket creation error:', error);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
