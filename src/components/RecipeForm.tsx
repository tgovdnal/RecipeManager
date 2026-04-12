'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { createRecipe, updateRecipe } from '@/app/actions';

const recipeSchema = z.object({
  title: z.string().min(3, "Titel muss mindestens 3 Zeichen lang sein"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein"),
  difficulty: z.enum(['Einfach', 'Mittel', 'Schwer'], {
    message: "Bitte wählen Sie einen Schwierigkeitsgrad",
  }),
  cookingTimeMinutes: z.number().min(1, "Zubereitungszeit muss positiv sein"),
  servings: z.number().min(1, "Mindestens 1 Portion"),
  ingredients: z.array(z.object({
    value: z.string().min(1, "Zutat darf nicht leer sein")
  })).min(1, "Mindestens eine Zutat wird benötigt"),
  instructions: z.array(z.object({
    value: z.string().min(1, "Schritt darf nicht leer sein")
  })).min(1, "Mindestens ein Schritt wird benötigt"),
  tags: z.string(),
  image: z.any().optional(), // File upload client-side handled manually
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

type RecipeFormProps = {
  initialData?: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    cookingTimeMinutes: number;
    servings: number;
    ingredients: string; // JSON string
    instructions: string; // JSON string
    tags: string; // JSON string
    imageUrl: string | null;
  };
};

export default function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  let parsedIngredients = [{ value: "" }];
  let parsedInstructions = [{ value: "" }];
  let parsedTags = "";

  if (initialData) {
    try { parsedIngredients = JSON.parse(initialData.ingredients).map((v: string) => ({ value: v })); } catch (e) {}
    try { parsedInstructions = JSON.parse(initialData.instructions).map((v: string) => ({ value: v })); } catch (e) {}
    try { parsedTags = JSON.parse(initialData.tags).join(', '); } catch (e) { parsedTags = initialData.tags; }
  }

  const { register, control, handleSubmit, formState: { errors } } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficulty: (initialData?.difficulty as 'Einfach'|'Mittel'|'Schwer') || "Mittel",
      cookingTimeMinutes: initialData?.cookingTimeMinutes || 30,
      servings: initialData?.servings || 4,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      tags: parsedTags,
    }
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: "ingredients" });
  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({ control, name: "instructions" });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Das Bild darf maximal 5MB groß sein.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RecipeFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('difficulty', data.difficulty);
      formData.append('cookingTimeMinutes', data.cookingTimeMinutes.toString());
      formData.append('servings', data.servings.toString());

      const ingredientsList = data.ingredients.map(i => i.value);
      formData.append('ingredients', JSON.stringify(ingredientsList));

      const instructionsList = data.instructions.map(i => i.value);
      formData.append('instructions', JSON.stringify(instructionsList));

      const tagsList = data.tags.split(',').map(t => t.trim()).filter(t => t);
      formData.append('tags', JSON.stringify(tagsList));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      let result;
      if (initialData) {
        formData.append('id', initialData.id);
        result = await updateRecipe(formData);
      } else {
        result = await createRecipe(formData);
      }

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || "Ein unbekannter Fehler ist aufgetreten.");
      }
    } catch (err: any) {
      setError(err.message || "Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto my-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Basics */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rezeptname</label>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="z.B. Spaghetti Carbonara"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Eine kurze Beschreibung deines Rezepts..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dauer (Minuten)</label>
              <input
                type="number"
                {...register("cookingTimeMinutes", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.cookingTimeMinutes && <p className="mt-1 text-sm text-red-600">{errors.cookingTimeMinutes.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portionen</label>
              <input
                type="number"
                {...register("servings", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.servings && <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schwierigkeit</label>
            <select
              {...register("difficulty")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="Einfach">Einfach</option>
              <option value="Mittel">Mittel</option>
              <option value="Schwer">Schwer</option>
            </select>
            {errors.difficulty && <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (kommagetrennt)</label>
            <input
              {...register("tags")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Vegetarisch, Schnell, Pasta"
            />
          </div>
        </div>

        {/* Right Column - Image & Meta */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bild</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative w-full h-48 overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                        <span>Lade eine Datei hoch</span>
                        <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP bis zu 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium text-gray-900">Zutaten</label>
          <button
            type="button"
            onClick={() => appendIngredient({ value: "" })}
            className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Plus size={16} className="mr-1" /> Zutat hinzufügen
          </button>
        </div>
        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`ingredients.${index}.value` as const)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="z.B. 200g Mehl"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={ingredientFields.length === 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {errors.ingredients && <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-medium text-gray-900">Zubereitungsschritte</label>
          <button
            type="button"
            onClick={() => appendInstruction({ value: "" })}
            className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Plus size={16} className="mr-1" /> Schritt hinzufügen
          </button>
        </div>
        <div className="space-y-4">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {index + 1}
              </span>
              <textarea
                {...register(`instructions.${index}.value` as const)}
                rows={2}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Zubereitungsschritt..."
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                disabled={instructionFields.length === 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 mt-1"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {errors.instructions && <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-70"
        >
          <Save size={18} className="mr-2" />
          {isSubmitting ? 'Speichert...' : (initialData ? 'Änderungen speichern' : 'Rezept erstellen')}
        </button>
      </div>
    </form>
  );
}