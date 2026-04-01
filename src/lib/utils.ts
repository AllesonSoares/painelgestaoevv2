import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const cleaned = dateStr.replace(/^"|"$/g, "");
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("pt-BR");
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
