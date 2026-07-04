"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/shared";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialActionState);

  return (
    <Card className="!bg-white/10 text-white">
      <form action={formAction} className="flex flex-col gap-4">
        <FormField label="Email" name="email" type="email" required autoComplete="email" />
        <FormField
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        {state.error && <p className="text-sm text-red-300">{state.error}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in…" : "Log in"}
        </Button>
        <p className="text-center text-sm text-white/70">
          <Link href="/entry" className="underline">
            Back
          </Link>
        </p>
      </form>
    </Card>
  );
}
