import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    const roles = (session?.user as unknown as { roles?: string[] })?.roles || [];
    
    // Allow owner, admin, or staff
    const allowed = roles.some((r) => ['owner', 'admin', 'moderator', 'developer'].includes(r.toLowerCase()));
    if (!allowed && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      registeredUsers,
      newUsersToday,
      pendingTickets,
      newTickets,
      orders,
      onlinePlayers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_REVIEW', 'WAITING_USER'] } } }),
      prisma.ticket.count({ where: { createdAt: { gte: today } } }),
      prisma.order.findMany({
        where: { status: 'PAID' },
        select: { total: true, createdAt: true },
      }),
      prisma.minecraftPlayer.count({ where: { isOnline: true } }),
    ]);

    const todayOrders = orders.filter((o) => o.createdAt >= today).length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({ 
      success: true, 
      data: {
        onlinePlayers,
        registeredUsers,
        newUsersToday,
        newTickets,
        pendingTickets,
        todayOrders,
        revenue,
        serverOnline: true,
      } 
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
