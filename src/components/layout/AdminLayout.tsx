import * as React from 'react';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AdminSidebar />
      <main className="md:pl-64 flex-1">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
