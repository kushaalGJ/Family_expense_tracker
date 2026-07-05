import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { signOut } from "@/lib/actions/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entry");

  const modeCtx = await resolveModeContext(supabase, user);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Card>
        <div className="mb-1 text-sm text-muted">Account</div>
        <div className="font-medium">{user.email}</div>
        <div className="mt-1 text-sm text-muted">
          {modeCtx.mode === "family" ? `Family: ${modeCtx.familyName}` : "Private account"}
        </div>
      </Card>
      <ThemeToggle />
      <form action={signOut}>
        <Button type="submit" variant="danger" className="w-full">
          Sign out
        </Button>
      </form>
    </div>
  );
}
