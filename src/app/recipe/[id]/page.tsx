import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import PrintButton from "./PrintButton";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

export default async function RecipeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
  });

  if (!recipe) {
    notFound();
  }

  let ingredients: string[] = [];
  let instructions: string[] = [];
  let tags: string[] = [];

  try {
    ingredients = JSON.parse(recipe.ingredients);
  } catch (e) {
    ingredients = recipe.ingredients.split("\n");
  }
  try {
    instructions = JSON.parse(recipe.instructions);
  } catch (e) {
    instructions = recipe.instructions.split("\n");
  }
  try {
    tags = JSON.parse(recipe.tags);
  } catch (e) {
    tags = recipe.tags.split(",").filter((t: string) => t.trim());
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-surface min-h-screen">
        {/* Navigation & Actions */}
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
          <Link
            href="/"
            className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-label text-sm tracking-widest uppercase"
          >
            <span className="material-symbols-outlined mr-2 text-sm">
              arrow_back
            </span>
            Zurück zur Übersicht
          </Link>
          <div className="flex gap-4">
            <PrintButton />
            <Link
              href={`/recipe/${recipe.id}/edit`}
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-2 rounded-full font-label font-bold text-xs tracking-widest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Bearbeiten
            </Link>
            <DeleteButton id={recipe.id} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-16 print-avoid-break">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative group no-print">
              <div className="absolute -inset-4 bg-surface-container-high rounded-xl -z-10 transform -rotate-1"></div>
              {recipe.imageUrl ? (
                <img
                  alt={recipe.title}
                  className="w-full h-[500px] object-cover rounded-lg shadow-sm group-hover:scale-[1.01] transition-transform duration-500"
                  src={recipe.imageUrl}
                />
              ) : (
                <div className="w-full h-[500px] bg-surface-container flex items-center justify-center rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-9xl text-on-surface-variant opacity-30">
                    restaurant
                  </span>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2 no-print">
                <span className="bg-surface-container-highest px-3 py-1 rounded-full font-label text-[10px] font-bold text-primary tracking-widest uppercase">
                  {recipe.difficulty}
                </span>
                {recipe.category && (
                  <span className="bg-surface-container-highest px-3 py-1 rounded-full font-label text-[10px] font-bold text-tertiary tracking-widest uppercase">
                    {recipe.category}
                  </span>
                )}
                {tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-surface-container-highest px-3 py-1 rounded-full font-label text-[10px] font-bold text-tertiary tracking-widest uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-5xl md:text-6xl font-headline text-on-surface leading-tight tracking-tight">
                {recipe.title}
              </h1>

              <p className="text-lg text-on-surface-variant font-body leading-relaxed max-w-md no-print">
                {recipe.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-tighter text-on-surface-variant">
                    Dauer
                  </p>
                  <p className="font-headline text-xl text-on-surface">
                    {recipe.cookingTimeMinutes} Min
                  </p>
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase tracking-tighter text-on-surface-variant">
                    Portionen
                  </p>
                  <p className="font-headline text-xl text-on-surface">
                    {recipe.servings} Pers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Ingredients */}
          <aside className="lg:col-span-4 space-y-12 print-avoid-break">
            <div className="bg-surface-container-low p-8 rounded-lg">
              <h2 className="text-2xl font-headline mb-8 flex items-center gap-3 text-on-surface">
                Zutaten
                <span className="h-px flex-grow bg-outline-variant/30 no-print"></span>
              </h2>
              <ul className="space-y-4">
                {ingredients.map((ingredient, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="mt-1 w-5 h-5 rounded border-2 border-primary/30 group-hover:border-primary transition-colors flex items-center justify-center shrink-0 no-print">
                      <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-primary">
                        check
                      </span>
                    </div>
                    <span className="text-on-surface font-body">
                      {ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Column: Instructions */}
          <article className="lg:col-span-8">
            <h2 className="text-3xl font-headline text-on-surface mb-12">
              Zubereitung
            </h2>
            <div className="space-y-16">
              {instructions.map((step, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start print-avoid-break"
                >
                  <div className="md:col-span-1">
                    <span className="text-4xl font-headline text-primary-container opacity-40">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="md:col-span-11 space-y-4 pt-1">
                    <p className="text-on-surface font-body leading-relaxed text-lg">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-high w-full mt-24 rounded-t-lg no-print">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-lg font-headline italic text-on-surface">
              SilkSavor
            </span>
            <p className="text-[10px] font-label text-on-surface/70">
              © 2024 SilkSavor. Bereitgestellt von RecipeManager.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
