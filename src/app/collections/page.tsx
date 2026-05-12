import Header from '@/components/Header';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function CollectionsPage() {
  const recipes = await prisma.recipe.findMany();

  const categoryCounts = recipes.reduce((acc, recipe) => {
    if (recipe.category) {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Header />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <div className="mb-8 px-2">
          <h1 className="text-3xl md:text-5xl font-headline text-on-surface tracking-tight leading-tight">Entdecke Collections</h1>
          <p className="text-on-surface-variant mt-2 font-medium">Handverlesene Rezepte für jeden Moment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <Link href="/?category=Unter 30 Minuten" className="relative group h-64 md:h-80 w-full rounded-3xl bg-surface-container-high shadow-lg transition-all duration-200 overflow-hidden block">
            <img
              className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
              alt="Unter 30 Minuten"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="bg-primary/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-label font-bold tracking-widest mb-2 inline-block uppercase">Blitzrezepte</span>
              <h2 className="text-2xl font-headline text-white">Unter 30 Minuten</h2>
              <p className="text-white/80 text-sm font-label">{categoryCounts['Unter 30 Minuten'] || 0} Rezepte</p>
            </div>
          </Link>

          <Link href="/?category=Vegetarisch" className="relative group h-64 md:h-80 w-full rounded-3xl bg-surface-container-high shadow-lg transition-all duration-200 overflow-hidden block">
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"
              alt="Vegetarisch"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="bg-tertiary/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-label font-bold tracking-widest mb-2 inline-block uppercase">Plant Based</span>
              <h2 className="text-2xl font-headline text-white">Vegetarisch</h2>
              <p className="text-white/80 text-sm font-label">{categoryCounts['Vegetarisch'] || 0} Rezepte</p>
            </div>
          </Link>

          <Link href="/?category=Saisonale Favoriten" className="relative group h-64 md:h-80 w-full rounded-3xl bg-surface-container-high shadow-lg transition-all duration-200 overflow-hidden block">
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop"
              alt="Saisonale Favoriten"
            />
            <div className="absolute inset-0 bg-on-surface/40 group-hover:bg-on-surface/30 transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="bg-secondary/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-label font-bold tracking-widest mb-2 inline-block uppercase">Herbst</span>
              <h2 className="text-2xl font-headline text-white leading-tight">Saisonale Favoriten</h2>
              <p className="text-white/80 text-sm font-label">{categoryCounts['Saisonale Favoriten'] || 0} Rezepte</p>
            </div>
          </Link>

          <Link href="/?category=Desserts" className="relative group h-64 md:h-80 w-full rounded-3xl bg-surface-container-high shadow-lg transition-all duration-200 overflow-hidden block lg:col-span-2">
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1551024506-0baa27542c12?q=80&w=2070&auto=format&fit=crop"
              alt="Desserts"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
               <span className="bg-primary/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-label font-bold tracking-widest mb-2 inline-block uppercase">Süßes</span>
              <h2 className="text-3xl font-headline text-white leading-tight">Desserts</h2>
              <p className="text-white/80 text-sm font-label">{categoryCounts['Desserts'] || 0} Rezepte</p>
            </div>
          </Link>

          <Link href="/?category=Gesunde Woche" className="relative group h-64 md:h-80 w-full rounded-3xl bg-surface-container-high shadow-lg transition-all duration-200 overflow-hidden block">
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
              alt="Gesunde Woche"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="bg-primary/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-label font-bold tracking-widest mb-2 inline-block uppercase">Meal Prep</span>
              <h2 className="text-2xl font-headline text-white">Gesunde Woche</h2>
              <p className="text-white/80 text-sm font-label">{categoryCounts['Gesunde Woche'] || 0} Rezepte</p>
            </div>
          </Link>

        </div>
      </main>
    </>
  );
}
