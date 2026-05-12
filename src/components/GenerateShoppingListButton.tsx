"use client";
import { useTransition } from "react";
import { generateShoppingList } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function GenerateShoppingListButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateShoppingList();
      if (res.success) {
        router.push("/shopping-list");
      }
    });
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isPending}
      className="bg-primary text-on-primary px-6 py-3 rounded-full font-label font-bold text-sm tracking-widest editorial-shadow hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[18px]">list_alt</span>
      {isPending ? "Generiere..." : "Liste aus Wochenplan generieren"}
    </button>
  );
}
