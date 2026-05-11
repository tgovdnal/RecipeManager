'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 bg-surface-container-lowest p-8 md:p-12 rounded-lg editorial-shadow border border-outline-variant/10 max-w-4xl mx-auto my-8">
      {error && (
        <div className="bg-error-container text-on-error-container p-6 rounded-lg text-sm font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Rezeptname</label>
            <input
              {...register("title")}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="z.B. Spaghetti Carbonara"
            />
            {errors.title && <p className="mt-2 text-xs text-error font-body">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Beschreibung</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-body focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Eine kurze Beschreibung deines Rezepts..."
            />
            {errors.description && <p className="mt-2 text-xs text-error font-body">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Dauer (Minuten)</label>
              <input
                type="number"
                {...register("cookingTimeMinutes", { valueAsNumber: true })}
                className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.cookingTimeMinutes && <p className="mt-2 text-xs text-error font-body">{errors.cookingTimeMinutes.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Portionen</label>
              <input
                type="number"
                {...register("servings", { valueAsNumber: true })}
                className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.servings && <p className="mt-2 text-xs text-error font-body">{errors.servings.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Schwierigkeit</label>
            <select
              {...register("difficulty")}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
            >
              <option value="Einfach">Einfach</option>
              <option value="Mittel">Mittel</option>
              <option value="Schwer">Schwer</option>
            </select>
            {errors.difficulty && <p className="mt-2 text-xs text-error font-body">{errors.difficulty.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Tags (kommagetrennt)</label>
            <input
              {...register("tags")}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Vegetarisch, Schnell, Pasta"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">Bild</label>
            <div className="mt-2 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-outline-variant border-dashed rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors relative min-h-[16rem]">
              <div className="space-y-2 text-center flex flex-col items-center w-full">
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
                      className="absolute top-2 right-2 p-2 bg-error text-on-error rounded-full hover:bg-error/90 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">image</span>
                    <div className="flex text-sm text-on-surface justify-center">
                      <label className="relative cursor-pointer bg-surface-container-lowest rounded-md px-4 py-2 font-label font-bold text-xs tracking-widest text-primary hover:text-primary-container focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary/40 editorial-shadow uppercase">
                        <span>Datei hochladen</span>
                        <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs text-on-surface-variant font-body mt-4">PNG, JPG, WEBP bis zu 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-12">
        <div className="flex items-center justify-between mb-6">
          <label className="block font-headline text-2xl text-on-surface">Zutaten</label>
          <button
            type="button"
            onClick={() => appendIngredient({ value: "" })}
            className="flex items-center text-xs font-label font-bold tracking-widest text-primary hover:text-primary-container uppercase transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-sm">add</span> Zutat hinzufügen
          </button>
        </div>
        <div className="space-y-4">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <input
                {...register(`ingredients.${index}.value` as const)}
                className="flex-1 w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-body focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="z.B. 200g Mehl"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={ingredientFields.length === 1}
                className="p-3 bg-surface-container-high rounded-lg text-on-surface-variant hover:text-error disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          {errors.ingredients && <p className="mt-2 text-xs text-error font-body">{errors.ingredients.message}</p>}
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-12">
        <div className="flex items-center justify-between mb-6">
          <label className="block font-headline text-2xl text-on-surface">Zubereitungsschritte</label>
          <button
            type="button"
            onClick={() => appendInstruction({ value: "" })}
            className="flex items-center text-xs font-label font-bold tracking-widest text-primary hover:text-primary-container uppercase transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-sm">add</span> Schritt hinzufügen
          </button>
        </div>
        <div className="space-y-6">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-6 items-start">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-surface-container-highest text-on-surface rounded-full font-label font-bold">
                {index + 1}
              </span>
              <textarea
                {...register(`instructions.${index}.value` as const)}
                rows={3}
                className="flex-1 w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-body focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="Zubereitungsschritt..."
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                disabled={instructionFields.length === 1}
                className="p-3 bg-surface-container-high rounded-lg text-on-surface-variant hover:text-error disabled:opacity-50 flex items-center justify-center transition-colors mt-1"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          {errors.instructions && <p className="mt-2 text-xs text-error font-body">{errors.instructions.message}</p>}
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-12 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-surface-container-high text-on-surface rounded-full font-label font-bold text-sm tracking-widest hover:bg-surface-container-highest transition-colors"
        >
          ABBRECHEN
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-label font-bold text-sm tracking-widest hover:scale-[1.02] transition-transform duration-200 shadow-lg shadow-primary/20 disabled:opacity-70 uppercase"
        >
          {isSubmitting ? 'Speichert...' : (initialData ? 'Änderungen speichern' : 'Rezept erstellen')}
        </button>
      </div>
    </form>
  );
}