import Link from 'next/link';
import { ChefHat, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-emerald-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
          <ChefHat size={28} />
          <span>Meine Rezepte</span>
        </Link>
        <Link
          href="/recipe/create"
          className="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <PlusCircle size={20} />
          <span>Neues Rezept</span>
        </Link>
      </div>
    </header>
  );
}