import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useAuth } from '@/contexts/AuthContext'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
