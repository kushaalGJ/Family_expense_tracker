"use client";

import { useActionState } from "react";
import Link from "next/link";
import { joinFamilyAccount } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/shared";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { ColorPicker } from "@/components/ui/ColorPicker";

export default function JoinFamilyPage() {
  const [state, formAction, isPending] = useActionState(joinFamilyAccount, initialActionState);

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">Join a family</h2>
      <form action={formAction} className="flex flex-col gap-4">
        <FormField
          label="Join code"
          name="code"
          required
          placeholder="X7K2QP"
          maxLength={6}
          className="uppercase tracking-widest"
        />
        <FormField label="Your name" name="name" required placeholder="Kushaal" />
        <EmojiPicker name="emoji" />
        <ColorPicker name="color" />
        <FormField label="Email" name="email" type="email" required autoComplete="email" />
        <FormField
          label="Password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
        {state.error && <p className="text-sm text-[rgb(var(--expense))]">{state.error}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Joining…" : "Join family"}
        </Button>
        <p className="text-center text-sm text-muted">
          <Link href="/entry" className="underline">
            Back
          </Link>
        </p>
      </form>
    </Card>
  );
}
