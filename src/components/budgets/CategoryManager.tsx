"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil } from "lucide-react";
import { ICON_LIBRARY } from "@/lib/constants/categoryIcons";
import { COLOR_OPTIONS } from "@/lib/constants/avatar";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import type { CategoryRow } from "@/lib/actions/categories";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const ICON_KEYS = Object.keys(ICON_LIBRARY);

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_KEYS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [pending, setPending] = useState(false);

  function openNew() {
    setEditing(null);
    setName("");
    setIcon(ICON_KEYS[0]);
    setColor(COLOR_OPTIONS[0]);
    setOpen(true);
  }

  function openEdit(c: CategoryRow) {
    setEditing(c);
    setName(c.name);
    setIcon(c.icon);
    setColor(c.color);
    setOpen(true);
  }

  async function save() {
    if (!name.trim()) return;
    setPending(true);
    if (editing) await updateCategory(editing.id, name, icon, color);
    else await createCategory(name, icon, color);
    setPending(false);
    setOpen(false);
    router.refresh();
  }

  async function remove(id: string) {
    await deleteCategory(id);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[17px] font-bold">Custom categories</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--accent))]"
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="px-1 text-sm text-muted">
          No custom categories yet. Add one to track spending your way.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {categories.map((c) => (
            <div key={c.id} className="card flex items-center gap-3 p-3.5">
              <CategoryIcon category={c.name} color={c.color} icon={c.icon} size={42} />
              <span className="flex-1 font-semibold">{c.name}</span>
              <button
                type="button"
                onClick={() => openEdit(c)}
                className="text-muted hover:text-foreground"
                aria-label="Edit category"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="text-muted hover:text-[rgb(var(--expense))]"
                aria-label="Delete category"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit category" : "New category"}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center py-1">
            <CategoryIcon category={name || "New"} color={color} icon={icon} size={64} />
          </div>
          <FormField label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Groceries" autoFocus />

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium opacity-80">Icon</span>
            <div className="grid grid-cols-8 gap-2">
              {ICON_KEYS.map((key) => {
                const Icon = ICON_LIBRARY[key];
                const active = icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      active ? "text-white" : "border border-[rgb(var(--card-border))] text-muted dark:border-white/10"
                    }`}
                    style={active ? { background: color } : undefined}
                  >
                    <Icon size={17} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium opacity-80">Color</span>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? "scale-110 ring-2 ring-offset-2 ring-offset-[rgb(var(--card))] ring-foreground" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button type="button" onClick={save} disabled={pending || !name.trim()}>
            {pending ? "Saving…" : editing ? "Save changes" : "Add category"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
