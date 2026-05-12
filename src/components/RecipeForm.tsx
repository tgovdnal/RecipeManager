"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { createRecipe, updateRecipe } from "@/app/actions";

const recipeSchema = z.object({
  title: z.string().min(3, "Titel muss mindestens 3 Zeichen lang sein"),
  description: z
    .string()
    .min(10, "Beschreibung muss mindestens 10 Zeichen lang sein"),
  difficulty: z.enum(["Einfach", "Mittel", "Schwer"]),
  cookingTimeMinutes: z.number().min(1, "Zubereitungszeit muss > 0 sein"),
  servings: z.number().min(1, "Portionen muss > 0 sein"),
  ingredients: z
    .array(z.object({ value: z.string().min(2, "Zutat darf nicht leer sein") }))
    .min(1, "Mindestens eine Zutat erforderlich"),
  instructions: z
    .array(
      z.object({ value: z.string().min(2, "Schritt darf nicht leer sein") }),
    )
    .min(1, "Mindestens ein Schritt erforderlich"),
  tags: z.string(),
  category: z.string().optional(),
  dietary: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

type RecipeFormProps = {
  initialData?: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    cookingTimeMinutes: number;
    servings: number;
    ingredients: string;
    instructions: string;
    tags: string;
    imageUrl: string | null;
    category?: string | null;
    dietary?: string | null;
  };
};

export default function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Parse initial data for arrays
  let defaultIngredients = [{ value: "" }];
  let defaultInstructions = [{ value: "" }];

  if (initialData) {
    try {
      const parsedIngs = JSON.parse(initialData.ingredients);
      if (Array.isArray(parsedIngs) && parsedIngs.length > 0) {
        defaultIngredients = parsedIngs.map((ing: string) => ({ value: ing }));
      } else {
        defaultIngredients = initialData.ingredients
          .split("\n")
          .filter((i) => i.trim())
          .map((i) => ({ value: i }));
      }
    } catch (e) {
      defaultIngredients = initialData.ingredients
        .split("\n")
        .filter((i) => i.trim())
        .map((i) => ({ value: i }));
    }

    try {
      const parsedInsts = JSON.parse(initialData.instructions);
      if (Array.isArray(parsedInsts) && parsedInsts.length > 0) {
        defaultInstructions = parsedInsts.map((inst: string) => ({
          value: inst,
        }));
      } else {
        defaultInstructions = initialData.instructions
          .split("\n")
          .filter((i) => i.trim())
          .map((i) => ({ value: i }));
      }
    } catch (e) {
      defaultInstructions = initialData.instructions
        .split("\n")
        .filter((i) => i.trim())
        .map((i) => ({ value: i }));
    }
  }

  // Parse tags to comma separated string if it's JSON
  let defaultTags = initialData?.tags || "";
  if (initialData?.tags) {
    try {
      const parsedTags = JSON.parse(initialData.tags);
      if (Array.isArray(parsedTags)) {
        defaultTags = parsedTags.join(", ");
      }
    } catch (e) {
      // it's already a string
    }
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficulty:
        (initialData?.difficulty as "Einfach" | "Mittel" | "Schwer") ||
        "Einfach",
      cookingTimeMinutes: initialData?.cookingTimeMinutes || 30,
      servings: initialData?.servings || 2,
      ingredients: defaultIngredients,
      instructions: defaultInstructions,
      tags: defaultTags,
      category: initialData?.category || "",
      dietary: initialData?.dietary || "",
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RecipeFormData) => {
    const formData = new FormData();

    // Convert arrays to JSON strings before appending
    const ingredientsJson = JSON.stringify(
      data.ingredients.map((i) => i.value),
    );
    const instructionsJson = JSON.stringify(
      data.instructions.map((i) => i.value),
    );

    // Convert comma separated tags to JSON array
    const tagsArray = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const tagsJson = JSON.stringify(tagsArray);

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("difficulty", data.difficulty);
    formData.append("cookingTimeMinutes", data.cookingTimeMinutes.toString());
    formData.append("servings", data.servings.toString());
    formData.append("ingredients", ingredientsJson);
    formData.append("instructions", instructionsJson);
    formData.append("tags", tagsJson);

    if (data.category) formData.append("category", data.category);
    if (data.dietary) formData.append("dietary", data.dietary);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (initialData?.id) {
      formData.append("id", initialData.id);
      const res = await updateRecipe(formData);
      if (res.success) {
        router.push(`/recipe/${initialData.id}`);
        router.refresh();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createRecipe(formData);
      if (res.success) {
        router.push("/");
        router.refresh();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
              Titel
            </label>
            <input
              {...register("title")}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-xl font-headline focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:font-body placeholder:text-base placeholder:opacity-50"
              placeholder="z.B. Sommerliche Zitronenpasta"
            />
            {errors.title && (
              <p className="mt-2 text-xs text-error font-body">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
              Beschreibung
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-body focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Eine kurze Beschreibung deines Rezepts..."
            />
            {errors.description && (
              <p className="mt-2 text-xs text-error font-body">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                Dauer (Minuten)
              </label>
              <input
                type="number"
                {...register("cookingTimeMinutes", { valueAsNumber: true })}
                className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.cookingTimeMinutes && (
                <p className="mt-2 text-xs text-error font-body">
                  {errors.cookingTimeMinutes.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                Portionen
              </label>
              <input
                type="number"
                {...register("servings", { valueAsNumber: true })}
                className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
              {errors.servings && (
                <p className="mt-2 text-xs text-error font-body">
                  {errors.servings.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                Schwierigkeit
              </label>
              <select
                {...register("difficulty")}
                className="w-full bg-surface-container-high border-none rounded-lg px-4 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="Einfach">Einfach</option>
                <option value="Mittel">Mittel</option>
                <option value="Schwer">Schwer</option>
              </select>
              {errors.difficulty && (
                <p className="mt-2 text-xs text-error font-body">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                Collection
              </label>
              <select
                {...register("category")}
                className="w-full bg-surface-container-high border-none rounded-lg px-4 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="">Keine</option>
                <option value="Unter 30 Minuten">Unter 30 Minuten</option>
                <option value="Vegetarisch">Vegetarisch</option>
                <option value="Saisonale Favoriten">Saisonale Favoriten</option>
                <option value="Desserts">Desserts</option>
                <option value="Gesunde Woche">Gesunde Woche</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                Ernährungsform
              </label>
              <select
                {...register("dietary")}
                className="w-full bg-surface-container-high border-none rounded-lg px-4 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="">Keine</option>
                <option value="Vegan">Vegan</option>
                <option value="Vegetarisch">Vegetarisch</option>
                <option value="Glutenfrei">Glutenfrei</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
              Tags (kommagetrennt)
            </label>
            <input
              {...register("tags")}
              className="w-full bg-surface-container-high border-none rounded-lg px-6 py-4 text-sm font-label focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Vegetarisch, Schnell, Pasta"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase mb-2">
              Bild
            </label>
            <div className="mt-2 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-outline-variant border-dashed rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors relative min-h-[16rem]">
              <div className="space-y-2 text-center flex flex-col items-center w-full">
                {imagePreview ? (
                  <div className="relative w-full h-48 overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-error text-on-error rounded-full hover:bg-error/90 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">
                        close
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">
                      image
                    </span>
                    <div className="flex text-sm text-on-surface justify-center">
                      <label className="relative cursor-pointer bg-surface-container-lowest rounded-md px-4 py-2 font-label font-bold text-xs tracking-widest text-primary hover:text-primary-container focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary/40 editorial-shadow uppercase">
                        <span>Datei hochladen</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-on-surface-variant font-body mt-4">
                      PNG, JPG, WEBP bis zu 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-12">
        <div className="flex items-center justify-between mb-6">
          <label className="block font-headline text-2xl text-on-surface">
            Zutaten
          </label>
          <button
            type="button"
            onClick={() => appendIngredient({ value: "" })}
            className="flex items-center text-xs font-label font-bold tracking-widest text-primary hover:text-primary-container uppercase transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-sm">add</span>{" "}
            Zutat hinzufügen
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
          {errors.ingredients && (
            <p className="mt-2 text-xs text-error font-body">
              {errors.ingredients.message}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-12">
        <div className="flex items-center justify-between mb-6">
          <label className="block font-headline text-2xl text-on-surface">
            Zubereitungsschritte
          </label>
          <button
            type="button"
            onClick={() => appendInstruction({ value: "" })}
            className="flex items-center text-xs font-label font-bold tracking-widest text-primary hover:text-primary-container uppercase transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-sm">add</span>{" "}
            Schritt hinzufügen
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
          {errors.instructions && (
            <p className="mt-2 text-xs text-error font-body">
              {errors.instructions.message}
            </p>
          )}
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
          {isSubmitting
            ? "Speichert..."
            : initialData
              ? "Änderungen speichern"
              : "Rezept erstellen"}
        </button>
      </div>
    </form>
  );
}
