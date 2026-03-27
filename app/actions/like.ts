'use server';

import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

const LIKES_COLLECTION = 'component_likes';

/**
 * Fetches the current like count for a specific component.
 * @param {string} componentId - The ID of the component (e.g., 'cursor-spring').
 * @returns {Promise<number>} - The current number of likes.
 */
export async function getLikes(componentId: string) {
  if (!db) {
    console.error('[Firebase] getLikes: Database not initialized. Check your Vercel Environment Variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
    return 0;
  }
  try {
    console.log(`[Firebase] Fetching likes for: ${componentId}`);
    const doc = await db.collection(LIKES_COLLECTION).doc(componentId).get();
    if (!doc.exists) {
      return 0;
    }
    return doc.data()?.count || 0;
  } catch (error) {
    console.error(`[Firebase Error] getLikes for ${componentId}:`, error);
    return 0;
  }
}

/**
 * Toggles a like for a component in Firestore (increment or decrement).
 * Uses a transaction to ensure data consistency and prevents the count from dropping below 0.
 * @param {string} componentId - The ID of the component to toggle.
 * @param {boolean} increment - True to add a like, false to remove one.
 * @returns {Promise<number>} - The updated total like count.
 */
export async function toggleLike(componentId: string, increment: boolean) {
  if (!db) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    console.error('[Firebase] toggleLike: Database not initialized.');
    throw new Error('Database not initialized');
  }
  try {
    const delta = increment ? 1 : -1;
    console.log(`[Firebase] Toggling like for: ${componentId} (Delta: ${delta})`);
    const docRef = db.collection(LIKES_COLLECTION).doc(componentId);
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        // Only set to 1 if incrementing. Decrementing a non-existent doc should do nothing or stay 0.
        transaction.set(docRef, { count: increment ? 1 : 0 });
      } else {
        const currentCount = doc.data()?.count || 0;
        const newCount = Math.max(0, currentCount + delta);
        transaction.update(docRef, { count: newCount });
      }
    });

    const updatedDoc = await docRef.get();
    const finalCount = updatedDoc.data()?.count || 0;
    console.log(`[Firebase] Success! New count for ${componentId}: ${finalCount}`);
    
    // Clear Next.js cache so the new count is visible immediately
    revalidatePath('/design/components');
    
    return finalCount;
  } catch (error: any) {
    console.error(`[Firebase Error] toggleLike for ${componentId}:`, error?.message || error);
    throw new Error(`Failed to update likes: ${error?.message || 'Unknown error'}`);
  }
}
