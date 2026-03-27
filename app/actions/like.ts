'use server';

import { getDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

const LIKES_COLLECTION = 'component_likes';

export async function getLikes(componentId: string): Promise<number> {
  const db = getDb();
  if (!db) {
    console.error('[Firebase] getLikes: DB not initialized. Check FIREBASE_SERVICE_ACCOUNT_JSON in Vercel env vars.');
    return 0;
  }
  try {
    const doc = await db.collection(LIKES_COLLECTION).doc(componentId).get();
    return doc.exists ? (doc.data()?.count ?? 0) : 0;
  } catch (error) {
    console.error(`[Firebase] getLikes error for ${componentId}:`, error);
    return 0;
  }
}

export async function toggleLike(componentId: string, increment: boolean): Promise<number> {
  const db = getDb();
  if (!db) {
    console.error('[Firebase] toggleLike: DB not initialized. Check FIREBASE_SERVICE_ACCOUNT_JSON in Vercel env vars.');
    throw new Error('Database not initialized');
  }
  try {
    const delta = increment ? 1 : -1;
    const docRef = db.collection(LIKES_COLLECTION).doc(componentId);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        transaction.set(docRef, { count: increment ? 1 : 0 });
      } else {
        const current = doc.data()?.count ?? 0;
        transaction.update(docRef, { count: Math.max(0, current + delta) });
      }
    });

    const updated = await docRef.get();
    const finalCount: number = updated.data()?.count ?? 0;

    revalidatePath('/design/components');
    return finalCount;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[Firebase] toggleLike error for ${componentId}:`, msg);
    throw new Error(`Failed to update likes: ${msg}`);
  }
}
