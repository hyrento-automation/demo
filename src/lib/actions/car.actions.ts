"use server"

import { unstable_noStore as noStore } from 'next/cache';
import { FALLBACK_FLEET } from '@/src/data/fallbackFleet'

export async function getPublicCars() {
  noStore();
  // Standalone, ultra-fast in-memory fleet decoupled from remote Supabase / database queries
  return FALLBACK_FLEET;
}
