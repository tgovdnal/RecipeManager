import RecipeCard from '@/components/RecipeCard';
import Header from '@/components/Header';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

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
    <>
      <Header />
      <main className="pt-24 pb-12">
        {recipes.length > 0 && !search && !difficulty && (
          <section className="max-w-7xl mx-auto px-6 mb-24">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              <div className="lg:col-span-7 z-10">
                <div className="rounded-lg overflow-hidden editorial-shadow bg-surface-container flex items-center justify-center aspect-[4/3]">
                  {recipes[0].imageUrl ? (
                    <img src={recipes[0].imageUrl} alt={recipes[0].title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-9xl text-on-surface-variant opacity-50">restaurant</span>
                  )}
                </div>
              </div>
              <div className="lg:col-span-6 lg:-ml-24 bg-surface-container-lowest p-8 md:p-16 rounded-lg editorial-shadow mt-[-40px] lg:mt-0 relative z-20 border border-outline-variant/10">
                <div className="flex gap-4 mb-6">
                  <span className="bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-label font-bold tracking-widest text-primary uppercase">NEUESTES REZEPT</span>
                  <span className="text-[10px] font-label font-bold tracking-widest text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span> {recipes[0].cookingTimeMinutes} MIN
                  </span>
                </div>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-on-surface mb-6 leading-tight tracking-tight">{recipes[0].title}</h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-md line-clamp-3">
                  {recipes[0].description}
                </p>
                <Link href={`/recipe/${recipes[0].id}`} className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-label font-bold text-sm tracking-widest hover:scale-[1.02] transition-transform duration-200 inline-flex items-center gap-2 shadow-lg shadow-primary/20">
                  REZEPT ANSEHEN <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <h2 className="font-headline text-3xl text-on-surface mb-2">Alle Rezepte</h2>
              <p className="font-body text-on-surface-variant">Entdecke deine kulinarische Reise.</p>
            </div>
            
            <form className="flex gap-4 w-full md:w-auto" method="GET">
              <input
                type="text"
                name="search"
                defaultValue={search}
                className="bg-surface-container-lowest border-none rounded-full px-6 py-3 text-sm font-label focus:ring-2 focus:ring-primary/40 editorial-shadow w-full md:w-64"
                placeholder="Rezepte suchen..."
              />
              <button
                type="submit"
                className="bg-primary text-on-primary px-6 py-3 rounded-full font-label font-bold text-sm tracking-widest editorial-shadow"
              >
                Suchen
              </button>
            </form>
          </div>
          
          {recipes.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-lg editorial-shadow">
              <h2 className="text-2xl font-headline text-on-surface mb-2">Keine Rezepte gefunden</h2>
              <p className="text-on-surface-variant">Versuche andere Suchbegriffe oder füge ein neues Rezept hinzu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-surface-container-high w-full mt-24 rounded-t-lg">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-lg font-headline italic text-on-surface">SilkSavor</span>
            <p className="text-[10px] font-label text-on-surface/70">© 2024 SilkSavor. Bereitgestellt von RecipeManager.</p>
          </div>
        </div>
      </footer>
    </>
  );
}