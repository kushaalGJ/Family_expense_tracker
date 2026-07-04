"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createFamilyAccount } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/shared";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { ColorPicker } from "@/components/ui/ColorPicker";

export default function CreateFamilyPage() {
  const [state, formAction, isPending] = useActionState(createFamilyAccount, initialActionState);

  return (
    <Card className="!bg-white/10 text-white">
      <h2 className="mb-4 text-lg font-semibold">Create your family</h2>
      <form action={formAction} className="flex flex-col gap-4">
        <FormField label="Family name" name="familyName" required placeholder="The Guptas" />
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
          {isPending ? "Creating…" : "Create Family"}
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
