import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateRecipePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Zurück zur Übersicht
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Neues Rezept erstellen</h1>
          <p className="text-gray-600 mt-2">Teile dein Lieblingsrezept mit anderen.</p>
        </div>

        <RecipeForm />
      </main>
    </div>
  );
}