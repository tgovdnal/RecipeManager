"use server";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const baseRecipeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(["Einfach", "Mittel", "Schwer"]),
  cookingTimeMinutes: z.coerce.number().min(1),
  servings: z.coerce.number().min(1),
  ingredients: z.string().min(2), // JSON stringified array
  instructions: z.string().min(2), // JSON stringified array
  tags: z.string(), // JSON stringified array
  category: z.string().optional().nullable(),
  dietary: z.string().optional().nullable(),
});

async function handleImageUpload(image: File | null): Promise<string | null> {
  if (!image || image.size === 0) return null;

  if (image.size > MAX_FILE_SIZE) {
    throw new Error("Bild ist zu groß (max 5MB)");
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
    throw new Error(
      "Nur .jpg, .jpeg, .png und .webp Formate werden unterstützt",
    );
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {}

  let fileExtension = "jpg";
  if (image.type === "image/png") fileExtension = "png";
  if (image.type === "image/webp") fileExtension = "webp";
  if (image.type === "image/jpeg" || image.type === "image/jpg")
    fileExtension = "jpg";

  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

export async function createRecipe(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      difficulty: formData.get("difficulty"),
      cookingTimeMinutes: formData.get("cookingTimeMinutes"),
      servings: formData.get("servings"),
      ingredients: formData.get("ingredients"),
      instructions: formData.get("instructions"),
      tags: formData.get("tags"),
      category: formData.get("category"),
      dietary: formData.get("dietary"),
    };

    const validatedData = baseRecipeSchema.parse(rawData);

    const imageFile = formData.get("image") as File | null;
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await handleImageUpload(imageFile);
    }

    await prisma.recipe.create({
      data: {
        ...validatedData,
        imageUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/collections");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create recipe:", error);
    return { success: false, error: "Fehler beim Erstellen des Rezepts" };
  }
}

export async function updateRecipe(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("Rezept ID fehlt");

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      difficulty: formData.get("difficulty"),
      cookingTimeMinutes: formData.get("cookingTimeMinutes"),
      servings: formData.get("servings"),
      ingredients: formData.get("ingredients"),
      instructions: formData.get("instructions"),
      tags: formData.get("tags"),
      category: formData.get("category"),
      dietary: formData.get("dietary"),
    };

    const validatedData = baseRecipeSchema.parse(rawData);

    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await handleImageUpload(imageFile);
    }

    const updateData: any = { ...validatedData };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await prisma.recipe.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath(`/recipe/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update recipe:", error);
    return { success: false, error: "Fehler beim Aktualisieren des Rezepts" };
  }
}

export async function deleteRecipe(id: string) {
  try {
    await prisma.recipe.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/collections");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete recipe:", error);
    return { success: false, error: "Fehler beim Löschen des Rezepts" };
  }
}

export async function toggleFavorite(recipeId: string) {
  try {
    const existing = await prisma.favorite.findUnique({
      where: { recipeId },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { recipeId },
      });
    } else {
      await prisma.favorite.create({
        data: { recipeId },
      });
    }
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/favorites");
    revalidatePath(`/recipe/${recipeId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to toggle favorite:", error);
    return { success: false, error: "Fehler beim Aktualisieren der Favoriten" };
  }
}

export async function addRecipeToWeeklyPlan(recipeId: string, dateStr: string) {
  try {
    const date = new Date(dateStr);
    await prisma.weeklyPlan.create({
      data: {
        recipeId,
        date,
      },
    });
    revalidatePath("/planner");
    return { success: true };
  } catch (error) {
    console.error("Failed to add recipe to weekly plan:", error);
    return { success: false, error: "Fehler beim Hinzufügen zum Wochenplaner" };
  }
}

export async function removeRecipeFromWeeklyPlan(id: string) {
  try {
    await prisma.weeklyPlan.delete({
      where: { id },
    });
    revalidatePath("/planner");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove from weekly plan:", error);
    return {
      success: false,
      error: "Fehler beim Entfernen aus dem Wochenplaner",
    };
  }
}

export async function toggleShoppingItem(id: string, checked: boolean) {
  try {
    await prisma.shoppingListItem.update({
      where: { id },
      data: { checked },
    });
    revalidatePath("/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle item:", error);
    return { success: false, error: "Fehler beim Aktualisieren" };
  }
}

export async function clearCheckedShoppingItems() {
  try {
    await prisma.shoppingListItem.deleteMany({
      where: { checked: true },
    });
    revalidatePath("/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear items:", error);
    return { success: false, error: "Fehler beim Löschen" };
  }
}

export async function generateShoppingList() {
  try {
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay() || 7;
    if (day !== 1) monday.setHours(-24 * (day - 1));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const plans = await prisma.weeklyPlan.findMany({
      where: {
        date: { gte: monday, lte: sunday },
      },
      include: { recipe: true },
    });

    const allIngredients = new Set<string>();

    for (const plan of plans) {
      let ingredientsArray: string[] = [];
      try {
        ingredientsArray = JSON.parse(plan.recipe.ingredients);
      } catch (e) {
        ingredientsArray = plan.recipe.ingredients
          ? plan.recipe.ingredients.split("\n")
          : [];
      }
      ingredientsArray.forEach((ing) => {
        if (ing.trim()) allIngredients.add(ing.trim());
      });
    }

    // simplistic approach: just add missing ingredients.
    // real-world app would need parsing amounts and merging (e.g. 1 onion + 2 onions = 3 onions)
    const existing = await prisma.shoppingListItem.findMany();
    const existingNames = new Set(existing.map((e) => e.name.toLowerCase()));

    const toCreate = Array.from(allIngredients).filter(
      (ing) => !existingNames.has(ing.toLowerCase()),
    );

    if (toCreate.length > 0) {
      await prisma.shoppingListItem.createMany({
        data: toCreate.map((name) => ({ name })),
      });
    }

    revalidatePath("/shopping-list");
    return { success: true };
  } catch (error) {
    console.error("Failed to generate list:", error);
    return { success: false, error: "Fehler beim Generieren der Liste" };
  }
}
