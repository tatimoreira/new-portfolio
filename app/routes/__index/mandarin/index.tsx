import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { InlineFormCard } from "~/components/mandarin/InlineFormCard";
import { PillButton } from "~/components/mandarin/PillButton";
import { VocabInput } from "~/components/mandarin/VocabInput";
import {
  addCategory,
  addEntry,
  deleteEntry,
  getCategories,
  updateCategory,
  updateEntry,
} from "~/models/vocab.server";
import { isAdmin, requireAdmin } from "~/utils/mandarin-auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const [categories, admin] = await Promise.all([
    getCategories(),
    isAdmin(request),
  ]);
  return json({ categories, admin });
};

export const action: ActionFunction = async ({ request }) => {
  await requireAdmin(request);
  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "addCategory") {
    const name = formData.get("name") as string;
    const emoji = (formData.get("emoji") as string) || "📚";
    if (name?.trim()) await addCategory(name.trim(), emoji);
    return redirect("/mandarin");
  }

  if (_action === "addEntry") {
    const hanzi = formData.get("hanzi") as string;
    const pinyin = formData.get("pinyin") as string;
    const english = formData.get("english") as string;
    const notes = (formData.get("notes") as string) || undefined;
    const categoryId = formData.get("categoryId") as string;
    if (hanzi && pinyin && english && categoryId) {
      await addEntry({ hanzi, pinyin, english, notes: notes || undefined, categoryId });
    }
    return redirect("/mandarin");
  }

  if (_action === "deleteEntry") {
    await deleteEntry(formData.get("id") as string);
    return redirect("/mandarin");
  }

  if (_action === "updateEntry") {
    const id = formData.get("id") as string;
    const hanzi = formData.get("hanzi") as string;
    const pinyin = formData.get("pinyin") as string;
    const english = formData.get("english") as string;
    const notes = (formData.get("notes") as string) || undefined;
    if (id && hanzi && pinyin && english) {
      await updateEntry(id, { hanzi, pinyin, english, notes: notes || undefined });
    }
    return redirect("/mandarin");
  }

  if (_action === "updateCategory") {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const emoji = (formData.get("emoji") as string) || "📚";
    if (id && name?.trim()) await updateCategory(id, name.trim(), emoji);
    return redirect("/mandarin");
  }

  return redirect("/mandarin");
};

type Category = {
  id: string;
  emoji: string;
  name: string;
  entries: {
    id: string;
    hanzi: string;
    pinyin: string;
    english: string;
    notes: string | null;
  }[];
};

export default function MandarinCatalog() {
  const { categories, admin } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const addingCategory = searchParams.get("addCategory") === "1";
  const addingEntryForCategory = searchParams.get("addEntry");
  const editingCategory = searchParams.get("editCategory");
  const editingEntry = searchParams.get("editEntry");

  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const query = search.trim().toLowerCase();

  const filteredCategories = (categories as Category[])
    .map((cat) => ({
      ...cat,
      entries: query
        ? cat.entries.filter(
            (e) =>
              e.hanzi.includes(query) ||
              e.pinyin.toLowerCase().includes(query) ||
              e.english.toLowerCase().includes(query) ||
              (e.notes ?? "").toLowerCase().includes(query)
          )
        : cat.entries,
    }))
    .filter((cat) => {
      if (query) return cat.entries.length > 0 || cat.name.toLowerCase().includes(query);
      return true;
    });

  function toggleCategory(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function isCategoryOpen(cat: Category) {
    if (query) return true; // always expand when searching
    if (editingEntry && cat.entries.some((e) => e.id === editingEntry)) return true;
    if (addingEntryForCategory === cat.id) return true;
    return openCategories.has(cat.id);
  }

  const totalEntries = categories.reduce(
    (acc: number, c: Category) => acc + c.entries.length,
    0
  );

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
          {categories.length} categories · {totalEntries} entries
        </p>
        {admin && (
          <PillButton
            onClick={() =>
              update(
                addingCategory
                  ? { addCategory: null }
                  : { addCategory: "1", addEntry: null }
              )
            }
          >
            {addingCategory ? "Cancel" : "+ Category"}
          </PillButton>
        )}
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search hanzi, pinyin, or translation…"
        className="w-full font-work text-sm bg-transparent border-b border-sub-color/40 text-text-color outline-none py-1.5 placeholder:opacity-30"
      />

      {admin && addingCategory && (
        <Form method="post">
          <InlineFormCard className="flex gap-2 items-center p-4">
            <input type="hidden" name="_action" value="addCategory" />
            <VocabInput
              name="emoji"
              placeholder="📚"
              defaultValue="📚"
              className="w-12 text-center"
            />
            <VocabInput
              name="name"
              placeholder="Category name"
              required
              autoFocus
              className="flex-1"
            />
            <PillButton type="submit" variant="filled" className="shrink-0">
              Add
            </PillButton>
          </InlineFormCard>
        </Form>
      )}

      {categories.length === 0 && (
        <p className="font-work text-sm text-text-color opacity-40 text-center py-10">
          No categories yet — add one above to get started.
        </p>
      )}

      {query && filteredCategories.length === 0 && (
        <p className="font-work text-sm text-text-color opacity-40 text-center py-10">
          No results for "{search}"
        </p>
      )}

      {filteredCategories.map((category) => (
        <div key={category.id} className="rounded-xl border border-sub-color/20 overflow-hidden">
          {/* Accordion header */}
          {admin && editingCategory === category.id ? (
            <Form method="post">
              <InlineFormCard className="flex gap-2 items-center rounded-none border-0">
                <input type="hidden" name="_action" value="updateCategory" />
                <input type="hidden" name="id" value={category.id} />
                <VocabInput name="emoji" defaultValue={category.emoji} className="w-12 text-center" />
                <VocabInput name="name" defaultValue={category.name} required autoFocus className="flex-1" />
                <PillButton type="submit" variant="filled" size="xs" className="shrink-0">Save</PillButton>
                <PillButton type="button" variant="ghost" size="xs" onClick={() => update({ editCategory: null })}>Cancel</PillButton>
              </InlineFormCard>
            </Form>
          ) : (
            <div
              className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-sub-color/5 transition-colors"
              onClick={() => toggleCategory(category.id)}
            >
              <h3 className="font-work text-base font-semibold text-sub-color flex items-center gap-2">
                <span>{category.emoji}</span>
                <span>{category.name}</span>
                <span className="text-xs font-light opacity-50">({category.entries.length})</span>
              </h3>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {admin && (
                  <PillButton
                    size="xs"
                    onClick={() =>
                      update(
                        addingEntryForCategory === category.id
                          ? { addEntry: null }
                          : { addEntry: category.id, addCategory: null }
                      )
                    }
                  >
                    {addingEntryForCategory === category.id ? "Cancel" : "+ entry"}
                  </PillButton>
                )}
                {admin && (
                  <button
                    onClick={() => update({ editCategory: category.id, addEntry: null, addCategory: null })}
                    className="font-work text-xs text-text-color opacity-30 hover:opacity-70 transition-opacity px-1"
                    title="Edit category"
                  >
                    ✎
                  </button>
                )}
                <span className="text-text-color opacity-30 text-xs transition-transform duration-200" style={{ display: "inline-block", transform: isCategoryOpen(category) ? "rotate(90deg)" : "rotate(0deg)" }}>
                  ›
                </span>
              </div>
            </div>
          )}

          {/* Collapsible body */}
          {isCategoryOpen(category) && (
            <div className="border-t border-sub-color/20 px-3 pb-3 pt-2 space-y-2">
              {admin && addingEntryForCategory === category.id && (
                <Form method="post">
                  <InlineFormCard className="grid grid-cols-2 gap-2">
                    <input type="hidden" name="_action" value="addEntry" />
                    <input type="hidden" name="categoryId" value={category.id} />
                    <VocabInput name="hanzi" placeholder="汉字" required autoFocus size="lg" />
                    <VocabInput name="pinyin" placeholder="pīnyīn" required />
                    <VocabInput name="english" placeholder="English" required />
                    <VocabInput name="notes" placeholder="Notes (optional)" className="opacity-70" />
                    <div className="col-span-2 flex justify-end gap-2 pt-1">
                      <PillButton type="button" variant="ghost" size="xs" onClick={() => update({ addEntry: null })}>
                        Cancel
                      </PillButton>
                      <PillButton type="submit" variant="filled" size="xs">
                        Save
                      </PillButton>
                    </div>
                  </InlineFormCard>
                </Form>
              )}

              {category.entries.length === 0 && !(admin && addingEntryForCategory === category.id) && (
                <p className="font-work text-xs text-text-color opacity-30 pl-2">
                  No entries yet
                </p>
              )}

              <div className="space-y-1">
                {category.entries.map((entry) =>
                  admin && editingEntry === entry.id ? (
                    <Form key={entry.id} method="post">
                      <InlineFormCard className="grid grid-cols-2 gap-2">
                        <input type="hidden" name="_action" value="updateEntry" />
                        <input type="hidden" name="id" value={entry.id} />
                        <VocabInput name="hanzi" defaultValue={entry.hanzi} required autoFocus size="lg" />
                        <VocabInput name="pinyin" defaultValue={entry.pinyin} required />
                        <VocabInput name="english" defaultValue={entry.english} required />
                        <VocabInput name="notes" defaultValue={entry.notes ?? ""} placeholder="Notes (optional)" className="opacity-70" />
                        <div className="col-span-2 flex justify-end gap-2 pt-1">
                          <PillButton type="button" variant="ghost" size="xs" onClick={() => update({ editEntry: null })}>
                            Cancel
                          </PillButton>
                          <PillButton type="submit" variant="filled" size="xs">
                            Save
                          </PillButton>
                        </div>
                      </InlineFormCard>
                    </Form>
                  ) : (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors group ${admin ? "hover:bg-sub-color/5 cursor-pointer" : ""}`}
                      onClick={() => admin && update({ editEntry: entry.id, editCategory: null, addEntry: null })}
                      title={admin ? "Click to edit" : undefined}
                    >
                      <span className="font-work text-2xl text-text-color min-w-[3rem]">
                        {entry.hanzi}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-work text-sm text-sub-color">{entry.pinyin}</span>
                        <span className="font-work text-sm text-text-color opacity-60 ml-2">
                          {entry.english}
                        </span>
                        {entry.notes && (
                          <span className="font-work text-xs text-text-color opacity-40 ml-2 italic">
                            {entry.notes}
                          </span>
                        )}
                      </div>
                      {admin && (
                        <Form
                          method="post"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input type="hidden" name="_action" value="deleteEntry" />
                          <input type="hidden" name="id" value={entry.id} />
                          <button
                            type="submit"
                            title="Delete entry"
                            className="text-red-400/50 hover:text-red-400 transition-colors px-1 text-lg leading-none"
                          >
                            ×
                          </button>
                        </Form>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
