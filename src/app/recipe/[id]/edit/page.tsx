export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';


export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
  });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Link href={`/recipe/${recipe.id}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Zurück zum Rezept
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Rezept bearbeiten</h1>
          <p className="text-gray-600 mt-2">{recipe.title} anpassen.</p>
        </div>

        <RecipeForm initialData={recipe} />
      </main>
    </div>
  );
}