"use client";

type DraggableRecipeProps = {
  recipe: { id: string; title: string; imageUrl: string | null };
};

export default function DraggableRecipe({ recipe }: DraggableRecipeProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("recipeId", recipe.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors flex items-center gap-4 group"
    >
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-14 h-14 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            restaurant
          </span>
        </div>
      )}
      <span className="text-sm font-headline text-on-surface line-clamp-2 leading-tight">
        {recipe.title}
      </span>
      <span className="material-symbols-outlined text-outline-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        drag_indicator
      </span>
    </div>
  );
}
