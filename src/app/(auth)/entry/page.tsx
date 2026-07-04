import Link from "next/link";
import { Card } from "@/components/ui/Card";

const PATHS = [
  {
    href: "/create-family",
    emoji: "👨‍👩‍👧‍👦",
    title: "Create Family",
    desc: "Start a family account and invite others with a join code.",
  },
  {
    href: "/join-family",
    emoji: "🔑",
    title: "Join Family",
    desc: "Have a join code? Add your profile to an existing family.",
  },
  {
    href: "/private-account",
    emoji: "🔒",
    title: "Private Account",
    desc: "Track your own spending — never visible to any family.",
  },
];

export default function EntryPage() {
  return (
    <div className="flex flex-col gap-3 text-white">
      {PATHS.map((p) => (
        <Link key={p.href} href={p.href}>
          <Card className="flex items-center gap-4 !bg-white/10 hover:!bg-white/15 transition-colors">
            <span className="text-3xl">{p.emoji}</span>
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-white/70">{p.desc}</div>
            </div>
          </Card>
        </Link>
      ))}
      <p className="mt-2 text-center text-sm text-white/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
