"use client";
import { useTransition } from "react";
import { clearCheckedShoppingItems } from "@/app/actions";

export default function ClearShoppingListButton() {
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    startTransition(async () => {
      await clearCheckedShoppingItems();
    });
  };

  return (
    <button
      onClick={handleClear}
      disabled={isPending}
      className="text-on-surface-variant hover:text-error text-sm font-label uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[16px]">delete</span>
      {isPending ? "Lösche..." : "Erledigte löschen"}
    </button>
  );
}
