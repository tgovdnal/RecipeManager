import { prisma } from "@/lib/prisma";
import DraggableRecipe from "@/components/DraggableRecipe";
import DroppableDay from "@/components/DroppableDay";
import Link from "next/link";
import GenerateShoppingListButton from "@/components/GenerateShoppingListButton";

export const dynamic = "force-dynamic";

export default async function PlannerPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { title: "asc" },
  });

  const today = new Date();
  // set to monday of this week
  const monday = new Date(today);
  const day = monday.getDay() || 7;
  if (day !== 1) monday.setHours(-24 * (day - 1));
  monday.setHours(0, 0, 0, 0);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const plans = await prisma.weeklyPlan.findMany({
    where: {
      date: {
        gte: weekDays[0],
        lte: weekDays[6],
      },
    },
    include: { recipe: true },
  });

  const daysLabel = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-headline text-display-md text-primary tracking-tight">
            Wochenplaner
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant mt-2">
            Plane deine Mahlzeiten für die Woche.
          </p>
        </div>
        <GenerateShoppingListButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-surface-container-low p-5 rounded-2xl editorial-shadow sticky top-24 h-[calc(100vh-120px)] flex flex-col">
            <h2 className="font-headline text-xl text-on-surface mb-4">
              Deine Rezepte
            </h2>
            <div className="overflow-y-auto flex-grow pr-2 flex flex-col gap-2 custom-scrollbar">
              {recipes.map((recipe) => (
                <DraggableRecipe key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="flex flex-col gap-6">
            {weekDays.map((date, idx) => {
              const dayPlans = plans.filter(
                (p) => new Date(p.date).toDateString() === date.toDateString(),
              );
              return (
                <DroppableDay
                  key={date.toISOString()}
                  date={date}
                  label={daysLabel[idx]}
                  plans={dayPlans}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
