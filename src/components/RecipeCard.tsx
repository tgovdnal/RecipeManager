import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ChefHat } from 'lucide-react';
import { clsx } from 'clsx';

type RecipeCardProps = {
  recipe: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    cookingTimeMinutes: number;
    servings: number;
    imageUrl: string | null;
    tags: string;
  }
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  let tags: string[] = [];
  try {
    tags = JSON.parse(recipe.tags);
  } catch (e) {
    tags = recipe.tags ? recipe.tags.split(',') : [];
  }

  const difficultyColor = {
    'Einfach': 'bg-green-100 text-green-800',
    'Mittel': 'bg-yellow-100 text-yellow-800',
    'Schwer': 'bg-red-100 text-red-800',
  }[recipe.difficulty] || 'bg-gray-100 text-gray-800';

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
        <div className="relative h-48 w-full bg-emerald-50 overflow-hidden flex items-center justify-center">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ChefHat className="text-emerald-200" size={64} />
          )}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
            <span className={clsx("px-2 py-1 text-xs font-semibold rounded-full shadow-sm", difficultyColor)}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">{recipe.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{recipe.description}</p>

          <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-emerald-600" />
              <span>{recipe.cookingTimeMinutes} Min.</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1 text-emerald-600" />
              <span>{recipe.servings} Port.</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}