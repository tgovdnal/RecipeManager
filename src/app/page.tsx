import { getRecipes } from "@/actions/recipe";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { Suspense } from "react";
import { UtensilsCrossed } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; difficulty?: string; tag?: string };
}) {
  const recipes = await getRecipes({
    search: searchParams.search,
    difficulty: searchParams.difficulty,
    tag: searchParams.tag,
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
          Entdecke <span className="text-orange-600">köstliche</span> Rezepte
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto md:mx-0">
          Ihre persönliche Sammlung für kulinarische Highlights.
        </p>
      </div>

      <Suspense fallback={<div className="h-16 mb-8">Lade Filter...</div>}>
        <RecipeFilters />
      </Suspense>

      <Suspense fallback={
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      }>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Keine Rezepte gefunden</h3>
            <p className="text-gray-500">
              Versuchen Sie einen anderen Suchbegriff oder erstellen Sie ein neues Rezept.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
