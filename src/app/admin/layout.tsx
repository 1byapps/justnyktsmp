import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const roles = (session?.user as unknown as { roles?: string[] })?.roles || [];
  const hasAccess = roles.some((r) =>
    ['owner', 'admin', 'moderator', 'developer', 'yonetici'].includes(r.toLowerCase())
  );

  if (!hasAccess && process.env.NODE_ENV === 'production') {
    redirect('/panel');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AdminSidebar />
      <div className="md:pl-64 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
