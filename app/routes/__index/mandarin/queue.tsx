import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { InlineFormCard } from "~/components/mandarin/InlineFormCard";
import { PillButton } from "~/components/mandarin/PillButton";
import { VocabInput } from "~/components/mandarin/VocabInput";
import {
  addQueueItem,
  completeQueueItem,
  deleteQueueItem,
  getCategories,
  getQueue,
} from "~/models/vocab.server";

export const loader: LoaderFunction = async () => {
  const [queue, categories] = await Promise.all([getQueue(), getCategories()]);
  return json({ queue, categories });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "addQueueItem") {
    const description = formData.get("description") as string;
    const context = (formData.get("context") as string) || undefined;
    const priority = formData.get("priority") === "on";
    if (description?.trim()) {
      await addQueueItem({ description: description.trim(), context: context || undefined, priority });
    }
    return redirect("/mandarin/queue");
  }

  if (_action === "deleteQueueItem") {
    await deleteQueueItem(formData.get("id") as string);
    return redirect("/mandarin/queue");
  }

  if (_action === "completeQueueItem") {
    const id = formData.get("id") as string;
    const hanzi = formData.get("hanzi") as string;
    const pinyin = formData.get("pinyin") as string;
    const english = formData.get("english") as string;
    const notes = (formData.get("notes") as string) || undefined;
    const categoryId = formData.get("categoryId") as string;
    if (hanzi && pinyin && english && categoryId) {
      await completeQueueItem(id, { hanzi, pinyin, english, notes: notes || undefined, categoryId });
    }
    return redirect("/mandarin/queue");
  }

  return redirect("/mandarin/queue");
};

type QueueItem = {
  id: string;
  description: string;
  context: string | null;
  priority: boolean;
  createdAt: string;
};

type Category = { id: string; emoji: string; name: string };

export default function MandarinQueue() {
  const { queue, categories } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const completingId = searchParams.get("completing");
  const addingItem = searchParams.get("add") === "1";

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(changes)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-work text-sm text-text-color opacity-50">
          {queue.length} item{queue.length !== 1 ? "s" : ""} to research
        </p>
        <PillButton
          onClick={() =>
            update(addingItem ? { add: null } : { add: "1", completing: null })
          }
        >
          {addingItem ? "Cancel" : "+ Add item"}
        </PillButton>
      </div>

      {addingItem && (
        <Form method="post">
          <InlineFormCard className="space-y-3 p-4">
            <input type="hidden" name="_action" value="addQueueItem" />
            <VocabInput
              name="description"
              placeholder="What do you need to look up?"
              required
              autoFocus
              className="w-full"
            />
            <VocabInput
              name="context"
              placeholder="Context (e.g. bedtime, playground, mealtime)"
              className="w-full opacity-70"
            />
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2 font-work text-xs text-text-color opacity-70 cursor-pointer select-none">
                <input type="checkbox" name="priority" className="accent-sub-color" />
                Mark as priority
              </label>
              <PillButton type="submit" variant="filled" size="xs">
                Add to queue
              </PillButton>
            </div>
          </InlineFormCard>
        </Form>
      )}

      {queue.length === 0 && (
        <p className="font-work text-sm text-text-color opacity-40 text-center py-10">
          Queue is empty — nothing to research!
        </p>
      )}

      <div className="space-y-2">
        {(queue as QueueItem[]).map((item) => (
          <div key={item.id} className="rounded-xl border border-sub-color/20 overflow-hidden">
            <div className="flex items-start gap-2 p-3">
              {item.priority && (
                <span className="text-sub-color text-sm mt-0.5 shrink-0">★</span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-work text-sm text-text-color">{item.description}</p>
                {item.context && (
                  <p className="font-work text-xs text-text-color opacity-50 mt-0.5">
                    {item.context}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <PillButton
                  size="xs"
                  onClick={() =>
                    update(
                      completingId === item.id
                        ? { completing: null }
                        : { completing: item.id, add: null }
                    )
                  }
                >
                  Complete
                </PillButton>
                <Form method="post">
                  <input type="hidden" name="_action" value="deleteQueueItem" />
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    title="Delete"
                    className="text-red-400/50 hover:text-red-400 transition-colors px-1 text-lg leading-none"
                  >
                    ×
                  </button>
                </Form>
              </div>
            </div>

            {completingId === item.id && (
              <Form method="post" className="border-t border-sub-color/20">
                <InlineFormCard className="space-y-3 rounded-none border-0">
                  <input type="hidden" name="_action" value="completeQueueItem" />
                  <input type="hidden" name="id" value={item.id} />
                  <p className="font-work text-xs text-sub-color font-medium">
                    Fill in what you learned:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <VocabInput name="hanzi" placeholder="汉字" required autoFocus size="lg" />
                    <VocabInput name="pinyin" placeholder="pīnyīn" required />
                    <VocabInput name="english" placeholder="English" required />
                    <VocabInput name="notes" placeholder="Notes (optional)" className="opacity-70" />
                  </div>
                  <select
                    name="categoryId"
                    required
                    defaultValue=""
                    className="w-full font-work text-sm bg-bkg border-b border-sub-color/50 text-text-color outline-none p-1"
                  >
                    <option value="" disabled>Select category...</option>
                    {(categories as Category[]).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <PillButton
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => update({ completing: null })}
                    >
                      Cancel
                    </PillButton>
                    <PillButton type="submit" variant="filled" size="xs">
                      Save to catalog
                    </PillButton>
                  </div>
                </InlineFormCard>
              </Form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
