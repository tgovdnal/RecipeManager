import { notFound } from "next/navigation";
import Header from "@/components/Header";
import RecipeForm from "@/components/RecipeForm";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href={`/recipe/${recipe.id}`}
            className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-label text-sm tracking-widest uppercase mb-8"
          >
            <span className="material-symbols-outlined mr-2 text-sm">
              arrow_back
            </span>
            Zurück zum Rezept
          </Link>
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">
              Rezept bearbeiten
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              {recipe.title} anpassen.
            </p>
          </div>

          <RecipeForm initialData={recipe} />
        </div>
      </main>
    </>
  );
}
