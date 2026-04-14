import { type ActionFunction, type LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { InlineFormCard } from "~/components/mandarin/InlineFormCard";
import { PillButton } from "~/components/mandarin/PillButton";
import { VocabInput } from "~/components/mandarin/VocabInput";
import {
  checkPassword,
  createAdminSession,
  isAdmin,
} from "~/utils/mandarin-auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  if (await isAdmin(request)) return redirect("/mandarin");
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const from = (formData.get("from") as string) || "/mandarin";

  if (!password || !checkPassword(password)) {
    return { error: "Incorrect password" };
  }

  return createAdminSession(from);
};

export default function MandarinLogin() {
  const actionData = useActionData<{ error?: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/mandarin";

  return (
    <div className="flex items-start justify-center mt-10">
      <div className="w-full max-w-xs">
        <InlineFormCard className="space-y-4 p-6">
          <p className="font-work text-sm font-semibold text-sub-color">
            Admin access
          </p>
          <Form method="post" className="space-y-3">
            <input type="hidden" name="from" value={from} />
            <VocabInput
              name="password"
              type="password"
              placeholder="Password"
              required
              autoFocus
              className="w-full"
            />
            {actionData?.error && (
              <p className="font-work text-xs text-red-400">{actionData.error}</p>
            )}
            <div className="flex justify-end">
              <PillButton type="submit" variant="filled" size="sm">
                Log in
              </PillButton>
            </div>
          </Form>
        </InlineFormCard>
      </div>
    </div>
  );
}
