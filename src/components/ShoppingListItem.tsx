"use client";
import { useTransition, useState } from "react";
import { toggleShoppingItem } from "@/app/actions";

export default function ShoppingListItem({
  item,
}: {
  item: { id: string; name: string; checked: boolean };
}) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(item.checked);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    startTransition(async () => {
      await toggleShoppingItem(item.id, newChecked);
    });
  };

  return (
    <label
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${checked ? "bg-surface-container opacity-60" : "bg-surface-container-lowest editorial-shadow"}`}
    >
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? "border-primary bg-primary" : "border-outline-variant bg-surface"}`}
      >
        {checked && (
          <span className="material-symbols-outlined text-on-primary text-[16px]">
            check
          </span>
        )}
      </div>
      <span
        className={`font-body text-lg transition-all ${checked ? "text-on-surface-variant line-through" : "text-on-surface"}`}
      >
        {item.name}
      </span>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={handleToggle}
        disabled={isPending}
      />
    </label>
  );
}
