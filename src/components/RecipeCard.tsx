import Link from 'next/link';


type RecipeCardProps = {
  recipe: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    cookingTimeMinutes: number;
    servings: number;
    imageUrl: string | null;
    tags: string;
  }
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  let tags: string[] = [];
  try {
    tags = JSON.parse(recipe.tags);
  } catch (e) {
    tags = recipe.tags ? recipe.tags.split(',') : [];
  }

  return (
    <div className="group">
      <Link href={`/recipe/${recipe.id}`}>
        <div className="rounded-lg overflow-hidden mb-4 relative bg-surface-container-high editorial-shadow aspect-[3/4] flex justify-center items-center">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-30 group-hover:scale-105 transition-transform duration-500">restaurant</span>
          )}
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">bookmark</span>
          </button>
        </div>
        <span className="text-[10px] font-label font-bold tracking-widest text-tertiary uppercase">{tags[0] || 'REZEPT'}</span>
        <h3 className="font-headline text-xl text-on-surface mt-2 group-hover:text-primary transition-colors line-clamp-1">{recipe.title}</h3>
        <div className="flex items-center gap-4 mt-3 text-on-surface-variant">
          <span className="text-xs font-label">{recipe.cookingTimeMinutes} MIN</span>
          <span className="text-xs font-label">•</span>
          <span className="text-xs font-label uppercase">{recipe.difficulty}</span>
        </div>
      </Link>
    </div>
  );
}