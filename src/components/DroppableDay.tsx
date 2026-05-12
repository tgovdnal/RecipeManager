"use client";

import { useTransition } from "react";
import {
  addRecipeToWeeklyPlan,
  removeRecipeFromWeeklyPlan,
} from "@/app/actions";

type DroppableDayProps = {
  date: Date;
  label: string;
  plans: { id: string; recipe: { title: string; imageUrl: string | null } }[];
};

export default function DroppableDay({
  date,
  label,
  plans,
}: DroppableDayProps) {
  const [isPending, startTransition] = useTransition();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("recipeId");
    if (recipeId) {
      startTransition(async () => {
        await addRecipeToWeeklyPlan(recipeId, date.toISOString());
      });
    }
  };

  const handleRemove = (planId: string) => {
    startTransition(async () => {
      await removeRecipeFromWeeklyPlan(planId);
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`min-h-[160px] p-6 bg-surface-container-lowest rounded-2xl ${isPending ? "opacity-50" : ""} flex flex-col gap-4 transition-colors editorial-shadow hover:shadow-lg relative overflow-hidden group`}
    >
      <div className="flex justify-between items-center relative z-10">
        <h3 className="font-headline text-2xl text-on-surface">{label}</h3>
        <span className="text-sm font-label text-outline uppercase tracking-widest">
          {date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>
      </div>
      {plans.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-outline-variant text-sm font-label tracking-widest uppercase border-2 border-dashed border-outline-variant/30 rounded-xl m-2 bg-surface/50 relative z-10">
          Rezept hier ablegen
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative group/item p-3 bg-surface rounded-xl shadow-sm border border-outline-variant/10 flex items-center gap-4 hover:border-primary/30 transition-colors"
            >
              {plan.recipe.imageUrl ? (
                <img
                  src={plan.recipe.imageUrl}
                  alt={plan.recipe.title}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-xs">
                    restaurant
                  </span>
                </div>
              )}
              <span className="text-sm font-headline text-on-surface line-clamp-2 pr-6 leading-tight">
                {plan.recipe.title}
              </span>
              <button
                onClick={() => handleRemove(plan.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error opacity-0 group-hover/item:opacity-100 transition-opacity bg-surface rounded-full p-1 shadow-sm"
                title="Entfernen"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
