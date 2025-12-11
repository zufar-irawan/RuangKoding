import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function parseSlug(fullSlug: string) {
  const splitIndex = fullSlug.lastIndexOf('-');

  if (splitIndex === -1) {
    return {
      id: fullSlug,
      originalSlug: fullSlug,
    }
  }

  const id = fullSlug.substring(splitIndex + 1);
  const originalSlug = fullSlug.substring(0, splitIndex);

  return {
    id,
    originalSlug
  }
}
