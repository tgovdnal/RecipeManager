export const dynamic = 'force-dynamic';
import RecipeCard from '@/components/RecipeCard';
import Header from '@/components/Header';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';


export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; difficulty?: string };
}) {
  const search = searchParams?.search || '';
  const difficulty = searchParams?.difficulty || '';

  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { tags: { contains: search } }
    ];
  }
  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  const recipes = await prisma.recipe.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <form className="flex flex-col md:flex-row gap-4" method="GET">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                defaultValue={search}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Suche nach Titel oder Tag..."
              />
            </div>
            <div className="w-full md:w-64">
              <select
                name="difficulty"
                defaultValue={difficulty}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Alle Schwierigkeiten</option>
                <option value="Einfach">Einfach</option>
                <option value="Mittel">Mittel</option>
                <option value="Schwer">Schwer</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap hidden md:block"
            >
              Suchen
            </button>
          </form>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Keine Rezepte gefunden</h2>
            <p className="text-gray-500">Versuche es mit anderen Suchbegriffen oder füge ein neues Rezept hinzu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}