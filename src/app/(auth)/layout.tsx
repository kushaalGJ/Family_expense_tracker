export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="header-gradient flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-white">
          <h1 className="text-3xl font-bold">💰 FamilySpend</h1>
          <p className="mt-1 text-white/80">Track spending, together or on your own.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
