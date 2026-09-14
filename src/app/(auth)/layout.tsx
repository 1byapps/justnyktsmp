export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 sm:p-8">
      <div className="absolute inset-0 z-0 bg-[url('/bg-pattern.svg')] opacity-5" />
      <div className="z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
