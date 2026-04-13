export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Edit, ChevronLeft } from 'lucide-react';
import DeleteButton from './DeleteButton';
import RecipeInteractive from './RecipeInteractive';
import { prisma } from '@/lib/prisma';


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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-emerald-600 text-white shadow-md mb-8 print:hidden">
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
        <RecipeInteractive
          recipe={recipe}
          initialIngredients={ingredients}
          instructions={instructions}
          tags={tags}
        />
      </main>
    </div>
  );
}