"use client";

import { useActionState } from "react";
import { Users } from "lucide-react";
import { joinExistingUserToFamily } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/shared";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function JoinFamilyInline() {
  const [state, formAction, isPending] = useActionState(joinExistingUserToFamily, initialActionState);

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--accent))]/12 text-[rgb(var(--accent))]">
        <Users size={30} strokeWidth={1.7} />
      </span>
      <div>
        <div className="text-lg font-bold">Join a family</div>
        <p className="mt-1 text-sm text-muted">
          Enter your family&apos;s join code to share expenses together. Your private data stays private.
        </p>
      </div>
      <form action={formAction} className="flex w-full flex-col gap-3">
        <FormField
          label="Join code"
          name="code"
          required
          placeholder="X7K2QP"
          maxLength={6}
          className="text-center uppercase tracking-[0.3em]"
        />
        {state.error && <p className="text-sm text-[rgb(var(--expense))]">{state.error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Joining…" : "Join family"}
        </Button>
      </form>
    </Card>
  );
}
