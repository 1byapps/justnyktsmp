import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, 'En az 3 karakter').max(16, 'En fazla 16 karakter'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
});

const rateLimits = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000;
    
    let rateLimit = rateLimits.get(ip);
    if (!rateLimit || rateLimit.resetAt < now) {
      rateLimit = { count: 1, resetAt: now + windowMs };
    } else {
      rateLimit.count += 1;
    }
    rateLimits.set(ip, rateLimit);

    if (rateLimit.count > 10) {
      return NextResponse.json({ success: false, error: 'Çok fazla istek, lütfen bekleyin.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];
      return NextResponse.json({ success: false, error: issue?.message || 'Geçersiz veri' }, { status: 400 });
    }

    const { username, email, password } = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Bu e-posta veya kullanıcı adı zaten kullanımda.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const defaultRole = await prisma.role.findFirst({
      where: { OR: [{ name: "user" }, { isDefault: true }] },
    });

    await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        profile: {
          create: {
            displayName: username,
          },
        },
        ...(defaultRole
          ? {
              userRoles: {
                create: {
                  roleId: defaultRole.id,
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json({ success: true, message: 'Kayıt başarılı.' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Sunucu hatası.' }, { status: 500 });
  }
}
