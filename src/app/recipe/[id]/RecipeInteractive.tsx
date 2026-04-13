"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Users, ChefHat, Plus, Minus, FileText, Maximize, X, ArrowLeft, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

interface RecipeInteractiveProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    cookingTimeMinutes: number;
    servings: number;
    imageUrl: string | null;
  };
  initialIngredients: string[];
  instructions: string[];
  tags: string[];
}

export default function RecipeInteractive({
  recipe,
  initialIngredients,
  instructions,
  tags,
}: RecipeInteractiveProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleServingsChange = (delta: number) => {
    setServings((prev) => Math.max(1, prev + delta));
  };

  const scaleIngredient = (ingredient: string, originalServings: number, newServings: number) => {
    // A simple regex to find numbers (including decimals and fractions like 1/2) at the start or inside the string.
    // This is a basic implementation. For more complex ingredient parsing, a specialized library would be better.
    return ingredient.replace(/(\d+(?:[\.,]\d+)?(?:\/\d+)?)/g, (match) => {
      let num = parseFloat(match.replace(',', '.'));
      if (match.includes('/')) {
        const [numStr, denStr] = match.split('/');
        num = parseInt(numStr, 10) / parseInt(denStr, 10);
      }
      if (isNaN(num)) return match;

      const scaled = (num / originalServings) * newServings;
      // Format to avoid long decimals like 1.3333333
      return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1).replace('.0', '');
    });
  };

  const ingredients = initialIngredients.map((ing) =>
    scaleIngredient(ing, recipe.servings, servings)
  );

  const difficultyColor = {
    Einfach: "bg-green-100 text-green-800",
    Mittel: "bg-yellow-100 text-yellow-800",
    Schwer: "bg-red-100 text-red-800",
  }[recipe.difficulty] || "bg-gray-100 text-gray-800";

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-8">
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

          <div className="p-8 md:w-1/2 flex flex-col justify-center relative">
             <div className="absolute top-4 right-4 flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                title="Als PDF exportieren"
              >
                <FileText size={20} />
              </button>
            </div>

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
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => handleServingsChange(-1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 print:hidden"
                      disabled={servings <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold min-w-[1.5rem] text-center">{servings}</span>
                    <button
                      onClick={() => handleServingsChange(1)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 print:hidden"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid">
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Zubereitung</h2>
              <button
                onClick={() => setIsCookingMode(true)}
                className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors font-medium text-sm print:hidden"
              >
                <Maximize size={16} />
                <span>Koch-Modus starten</span>
              </button>
            </div>
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

      {isCookingMode && (
        <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col print:hidden">
          <div className="p-6 flex justify-between items-center border-b border-gray-700">
            <span className="text-xl font-medium text-gray-400">
              Schritt {currentStepIndex + 1} von {instructions.length}
            </span>
            <button
              onClick={() => setIsCookingMode(false)}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 md:p-16">
            <p className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center max-w-5xl">
              {instructions[currentStepIndex]}
            </p>
          </div>

          <div className="p-8 flex justify-between items-center border-t border-gray-700 bg-gray-800/50">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 px-6 py-4 rounded-xl font-medium text-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="hidden sm:inline">Zurück</span>
            </button>

            <div className="flex space-x-2">
               {instructions.map((_, i) => (
                 <div
                   key={i}
                   className={clsx(
                     "w-3 h-3 rounded-full transition-colors",
                     i === currentStepIndex ? "bg-emerald-500" : "bg-gray-600"
                   )}
                 />
               ))}
            </div>

            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(instructions.length - 1, prev + 1))}
              disabled={currentStepIndex === instructions.length - 1}
              className="flex items-center space-x-2 px-6 py-4 rounded-xl font-medium text-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Weiter</span>
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
