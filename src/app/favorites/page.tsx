import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";

export const dynamic = "force-dynamic"; // Prevent caching so favorites are always up-to-date

export default async function FavoritesPage() {
  const favorites = await prisma.favorite.findMany({
    include: {
      recipe: {
        include: {
          favorites: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const recipes = favorites.map((f: any) => f.recipe);

  return (
    <main className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="pt-16 pb-12">
        <h1 className="font-headline text-display-lg text-primary tracking-tight -ml-1">
          Mein Kochbuch
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant mt-4 max-w-2xl">
          Deine persönliche Sammlung der besten Rezepte.
        </p>
      </header>

      {recipes.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {recipes.map((recipe: any) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      ) : (
        <div className="text-center py-24 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">
            menu_book
          </span>
          <h2 className="font-headline text-headline-sm text-on-surface">
            Noch keine Favoriten
          </h2>
          <p className="font-body text-on-surface-variant mt-2 max-w-sm mx-auto">
            Markiere Rezepte mit dem Lesezeichen-Symbol, um sie hier in deinem
            persönlichen Kochbuch zu speichern.
          </p>
        </div>
      )}
    </main>
  );
}
