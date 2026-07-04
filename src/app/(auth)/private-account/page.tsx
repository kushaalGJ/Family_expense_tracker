"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPrivateAccount } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/shared";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { ColorPicker } from "@/components/ui/ColorPicker";

export default function PrivateAccountPage() {
  const [state, formAction, isPending] = useActionState(createPrivateAccount, initialActionState);

  return (
    <Card className="!bg-white/10 text-white">
      <h2 className="mb-4 text-lg font-semibold">Create your private account</h2>
      <form action={formAction} className="flex flex-col gap-4">
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
        {state.error && <p className="text-sm text-red-300">{state.error}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create Private Account"}
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
