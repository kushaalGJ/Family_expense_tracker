import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { ModeProvider } from "@/lib/context/ModeContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entry");

  const modeValue = await resolveModeContext(supabase, user);

  return (
    <ModeProvider value={modeValue}>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-1">{children}</main>
        <BottomNav />
      </div>
    </ModeProvider>
  );
}
