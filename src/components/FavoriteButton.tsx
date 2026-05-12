"use client";
import { useTransition, useState } from "react";
import { toggleFavorite } from "@/app/actions";

export default function FavoriteButton({
  recipeId,
  initialIsFavorite,
}: {
  recipeId: string;
  initialIsFavorite: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    setIsFavorite(!isFavorite); // Optimistic UI update
    startTransition(async () => {
      const result = await toggleFavorite(recipeId);
      if (!result.success) {
        setIsFavorite(isFavorite); // Revert on failure
        console.error(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm transition-colors z-10 ${isFavorite ? "text-secondary" : "text-on-surface-variant hover:text-primary"}`}
    >
      <span className="material-symbols-outlined text-sm">
        {isFavorite ? "bookmark" : "bookmark_border"}
      </span>
    </button>
  );
}
