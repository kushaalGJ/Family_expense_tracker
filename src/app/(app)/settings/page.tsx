import Link from "next/link";
import { redirect } from "next/navigation";
import { IndianRupee, BarChart3, Info, ChevronRight, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resolveModeContext } from "@/lib/mode";
import { signOut } from "@/lib/actions/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AppLockSetting } from "@/components/layout/AppLockSetting";
import { DeleteAccountButton } from "@/components/layout/DeleteAccountButton";
import { JoinFamilyInline } from "@/components/family/JoinFamilyInline";
import { Button } from "@/components/ui/Button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted">{title}</h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
}) {
  const inner = (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--accent))]/12 text-[rgb(var(--accent))]">
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {value && <span className="text-sm text-muted">{value}</span>}
      {href && <ChevronRight size={16} className="text-muted" />}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entry");

  const modeCtx = await resolveModeContext(supabase, user);

  return (
    <div className="flex flex-col gap-6 pt-1">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card flex items-center gap-4 p-5">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-3xl text-3xl"
          style={{ backgroundColor: `${modeCtx.profile.color}22` }}
        >
          {modeCtx.profile.emoji}
        </span>
        <div className="min-w-0">
          <div className="text-lg font-bold">{modeCtx.profile.name}</div>
          <div className="truncate text-sm text-muted">{user.email}</div>
          <div className="mt-0.5 text-xs font-semibold text-[rgb(var(--accent))]">
            {modeCtx.mode === "family" ? `Family · ${modeCtx.familyName}` : "Private account"}
          </div>
        </div>
      </div>

      <Section title="Appearance">
        <ThemeToggle />
      </Section>

      <Section title="Security">
        <AppLockSetting />
      </Section>

      {modeCtx.mode !== "family" && (
        <Section title="Family">
          <JoinFamilyInline />
        </Section>
      )}

      <Section title="Preferences">
        <Row icon={<IndianRupee size={17} />} label="Currency" value="INR (₹)" />
        <Row icon={<BarChart3 size={17} />} label="Reports & export" href="/reports" />
      </Section>

      <Section title="About">
        <Row icon={<Info size={17} />} label="FamilySpend" value="v1.0" />
      </Section>

      <form action={signOut}>
        <Button type="submit" variant="secondary" className="w-full">
          <LogOut size={16} /> Sign out
        </Button>
      </form>

      <Section title="Danger zone">
        <DeleteAccountButton />
      </Section>
    </div>
  );
}
