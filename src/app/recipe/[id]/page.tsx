import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Edit, ChevronLeft, ChefHat } from 'lucide-react';
import { clsx } from 'clsx';
import DeleteButton from './DeleteButton';
import RecipeInteractive from './RecipeInteractive';
import { prisma } from '@/lib/prisma';

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
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 transition-colors hover:text-emerald-100">
            <ChevronLeft size={24} />
            <span className="text-lg font-medium">Zurück zur Übersicht</span>
          </Link>
          <div className="flex space-x-3">
            <Link
              href={`/recipe/${recipe.id}/edit`}
              className="flex items-center space-x-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-gray-100"
            >
              <Edit size={16} />
              <span className="hidden sm:inline">Bearbeiten</span>
            </Link>
            <DeleteButton id={recipe.id} />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4">
                />
              ) : (
                <ChefHat className="text-emerald-200" size={120} />
              )}
            </div>

            <div className="flex flex-col justify-center p-8 md:w-1/2">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className={clsx("px-3 py-1 text-sm font-semibold rounded-full", difficultyColor)}>
                  {recipe.difficulty}
                </span>
                {tags.map((tag, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                {recipe.title}
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                {recipe.description}
              </p>

              <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Zubereitung</p>
                    <p className="font-semibold">{recipe.cookingTimeMinutes} Min.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Portionen</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center text-xl font-bold text-gray-900">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-800">
                  {ingredients.length}
                </span>
                Zutaten
              </h2>
              <ul className="space-y-3">
                {ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 mt-1 text-emerald-500">•</span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Zubereitung</h2>
              <div className="space-y-6">
                {instructions.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                      {i + 1}
                    </div>
                    <p className="pt-1 leading-relaxed text-gray-700">{step}</p>
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