import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { ModeProvider } from "@/lib/context/ModeContext";
import { GradientHeader } from "@/components/layout/GradientHeader";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { AddFab } from "@/components/layout/AddFab";

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
        <GradientHeader />
        <main className="mx-auto -mt-4 w-full max-w-2xl flex-1 px-4 pb-6">{children}</main>
        <AddFab />
        <BottomTabBar />
      </div>
    </ModeProvider>
  );
}
