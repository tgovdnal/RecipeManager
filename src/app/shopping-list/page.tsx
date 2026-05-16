import { prisma } from "@/lib/prisma";
import ShoppingListItem from "@/components/ShoppingListItem";
import ClearShoppingListButton from "@/components/ClearShoppingListButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShoppingListPage() {
  const items = await prisma.shoppingListItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const uncheckedItems = items.filter((i: any) => !i.checked);
  const checkedItems = items.filter((i: any) => i.checked);

  return (
    <main className="min-h-screen pt-24 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <Link
            href="/planner"
            className="text-sm font-label text-on-surface-variant hover:text-primary mb-2 inline-flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            Zurück zum Planer
          </Link>
          <h1 className="font-headline text-display-md text-primary tracking-tight">
            Einkaufsliste
          </h1>
        </div>

        {checkedItems.length > 0 && <ClearShoppingListButton />}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">
            shopping_cart
          </span>
          <h2 className="font-headline text-headline-sm text-on-surface">
            Liste ist leer
          </h2>
          <p className="font-body text-on-surface-variant mt-2 max-w-sm mx-auto">
            Generiere eine Einkaufsliste aus deinem Wochenplaner oder füge
            manuell Zutaten hinzu.
          </p>
          <Link
            href="/planner"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label font-bold text-sm tracking-widest editorial-shadow hover:scale-[1.02] transition-transform"
          >
            Zum Wochenplaner
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {uncheckedItems.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-label tracking-widest uppercase text-on-surface-variant ml-2 mb-2">
                Zu besorgen
              </h2>
              {uncheckedItems.map((item: any) => (
                <ShoppingListItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {checkedItems.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-label tracking-widest uppercase text-on-surface-variant ml-2 mb-2 mt-4">
                Erledigt
              </h2>
              {checkedItems.map((item: any) => (
                <ShoppingListItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
