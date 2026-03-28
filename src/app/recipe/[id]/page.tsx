import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Edit, ChevronLeft, ChefHat } from 'lucide-react';
import { clsx } from 'clsx';
import DeleteButton from './DeleteButton';

const prisma = new PrismaClient();

export default async function RecipeDetailsPage({ params }: { params: { id: string } }) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
  });

  if (!recipe) {
    notFound();
  }

  let ingredients: string[] = [];
  let instructions: string[] = [];
  let tags: string[] = [];

  try { ingredients = JSON.parse(recipe.ingredients); } catch (e) { ingredients = recipe.ingredients.split('\n'); }
  try { instructions = JSON.parse(recipe.instructions); } catch (e) { instructions = recipe.instructions.split('\n'); }
  try { tags = JSON.parse(recipe.tags); } catch (e) { tags = recipe.tags.split(',').filter(t => t.trim()); }

  const difficultyColor = {
    'Einfach': 'bg-green-100 text-green-800',
    'Mittel': 'bg-yellow-100 text-yellow-800',
    'Schwer': 'bg-red-100 text-red-800',
  }[recipe.difficulty] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-emerald-600 text-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:text-emerald-100 transition-colors">
            <ChevronLeft size={24} />
            <span className="font-medium text-lg">Zurück zur Übersicht</span>
          </Link>
          <div className="flex space-x-3">
            <Link
              href={`/recipe/${recipe.id}/edit`}
              className="flex items-center space-x-1 bg-white text-emerald-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              <Edit size={16} />
              <span className="hidden sm:inline">Bearbeiten</span>
            </Link>
            <DeleteButton id={recipe.id} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto min-h-[300px] bg-emerald-50 flex items-center justify-center">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <ChefHat className="text-emerald-200" size={120} />
              )}
            </div>

            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={clsx("px-3 py-1 text-sm font-semibold rounded-full", difficultyColor)}>
                  {recipe.difficulty}
                </span>
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {recipe.title}
              </h1>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {recipe.description}
              </p>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Zubereitung</p>
                    <p className="font-semibold">{recipe.cookingTimeMinutes} Min.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Portionen</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mr-3 text-sm">
                  {ingredients.length}
                </span>
                Zutaten
              </h2>
              <ul className="space-y-3">
                {ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Zubereitung</h2>
              <div className="space-y-6">
                {instructions.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}