import Link from "next/link";
import { Users, KeyRound, Lock, ChevronRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

const PATHS: { href: string; icon: LucideIcon; title: string; desc: string; color: string }[] = [
  {
    href: "/create-family",
    icon: Users,
    title: "Create family",
    desc: "Start a family account and invite others with a join code.",
    color: "#7A5CFA",
  },
  {
    href: "/join-family",
    icon: KeyRound,
    title: "Join family",
    desc: "Have a join code? Add your profile to an existing family.",
    color: "#16A34A",
  },
  {
    href: "/private-account",
    icon: Lock,
    title: "Private account",
    desc: "Track your own spending — never visible to any family.",
    color: "#EC4899",
  },
];

export default function EntryPage() {
  return (
    <div className="flex flex-col gap-3">
      {PATHS.map((p) => {
        const Icon = p.icon;
        return (
          <Link key={p.href} href={p.href}>
            <Card className="flex items-center gap-4 transition-transform hover:scale-[1.01]">
              <span
                className="chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ ["--chip" as string]: p.color }}
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-muted">{p.desc}</div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-muted" />
            </Card>
          </Link>
        );
      })}
      <p className="mt-2 text-center text-sm text-white/80">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
