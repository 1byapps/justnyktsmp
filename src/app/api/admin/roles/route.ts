import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const [roles, permissions] = await Promise.all([
      prisma.role.findMany({
        orderBy: { priority: "desc" },
        include: {
          _count: { select: { rolePermissions: true } },
        },
      }),
      prisma.permission.findMany({
        orderBy: [{ category: "asc" }, { displayName: "asc" }],
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        roles: roles.map((r) => ({
          id: r.id,
          name: r.name,
          displayName: r.displayName,
          description: r.description,
          color: r.color,
          priority: r.priority,
          permissionCount: r._count.rolePermissions,
        })),
        permissions: permissions.map((p) => ({
          id: p.id,
          key: p.key,
          displayName: p.displayName,
          category: p.category,
        })),
      },
    });
  } catch (error) {
    console.error("Admin roles error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
