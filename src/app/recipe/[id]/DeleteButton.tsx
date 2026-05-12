"use client";

import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/app/actions";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Möchtest du dieses Rezept wirklich löschen?")) {
      setIsDeleting(true);
      const res = await deleteRecipe(id);
      if (res.success) {
        router.push("/");
      } else {
        alert(res.error || "Fehler beim Löschen");
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-error/10 hover:bg-error/20 text-error px-6 py-2 rounded-full font-label font-bold text-xs tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-sm">delete</span>
      <span className="hidden sm:inline">
        {isDeleting ? "Löscht..." : "Delete"}
      </span>
    </button>
  );
}
