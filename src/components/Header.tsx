import Link from 'next/link';

export default function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold font-headline text-on-background tracking-tight">
          SilkSavor
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-label text-sm tracking-wide text-on-background hover:text-primary transition-colors">Rezepte</Link>
          <Link href="/recipe/create" className="font-label text-sm tracking-wide text-on-background hover:text-primary transition-colors">Rezept hinzufügen</Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/recipe/create" className="hover:scale-[1.02] transition-transform duration-200">
            <span className="material-symbols-outlined text-on-surface">add_circle</span>
          </Link>
          <button className="hover:scale-[1.02] transition-transform duration-200">
            <span className="material-symbols-outlined text-on-surface">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
}