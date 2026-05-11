'use server';
import { prisma } from '@/lib/prisma';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const baseRecipeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(['Einfach', 'Mittel', 'Schwer']),
  cookingTimeMinutes: z.coerce.number().min(1),
  servings: z.coerce.number().min(1),
  ingredients: z.string().min(2), // JSON stringified array
  instructions: z.string().min(2), // JSON stringified array
  tags: z.string(), // JSON stringified array
});

async function handleImageUpload(image: File | null): Promise<string | null> {
  if (!image || image.size === 0) return null;

  if (image.size > MAX_FILE_SIZE) {
    throw new Error("Bild ist zu groß (max 5MB)");
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
    throw new Error("Nur .jpg, .jpeg, .png und .webp Formate werden unterstützt");
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {}

  let fileExtension = 'jpg';
  if (image.type === 'image/png') fileExtension = 'png';
  if (image.type === 'image/webp') fileExtension = 'webp';
  if (image.type === 'image/jpeg' || image.type === 'image/jpg') fileExtension = 'jpg';

  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

export async function createRecipe(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      difficulty: formData.get('difficulty'),
      cookingTimeMinutes: formData.get('cookingTimeMinutes'),
      servings: formData.get('servings'),
      ingredients: formData.get('ingredients'),
      instructions: formData.get('instructions'),
      tags: formData.get('tags'),
    };

    const validatedData = baseRecipeSchema.parse(rawData);

    const imageFile = formData.get('image') as File | null;
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

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create recipe:", error);
    return { success: false, error: error.message || "Fehler beim Erstellen des Rezepts" };
  }
}

export async function updateRecipe(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    if (!id) throw new Error("Rezept ID fehlt");

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      difficulty: formData.get('difficulty'),
      cookingTimeMinutes: formData.get('cookingTimeMinutes'),
      servings: formData.get('servings'),
      ingredients: formData.get('ingredients'),
      instructions: formData.get('instructions'),
      tags: formData.get('tags'),
    };

    const validatedData = baseRecipeSchema.parse(rawData);

    const imageFile = formData.get('image') as File | null;
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

    revalidatePath('/');
    revalidatePath(`/recipe/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update recipe:", error);
    return { success: false, error: error.message || "Fehler beim Aktualisieren des Rezepts" };
  }
}

export async function deleteRecipe(id: string) {
  try {
    await prisma.recipe.delete({
      where: { id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete recipe:", error);
    return { success: false, error: "Fehler beim Löschen des Rezepts" };
  }
}