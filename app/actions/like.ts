'use server';

import { db } from '@/lib/firebase-admin';

const LIKES_COLLECTION = 'component_likes';

/**
 * Fetches the current like count for a specific component.
 * @param {string} componentId - The ID of the component (e.g., 'cursor-spring').
 * @returns {Promise<number>} - The current number of likes.
 */
export async function getLikes(componentId: string) {
  if (!db) {
    console.error('[Firebase] Database not initialized. Check your environment variables.');
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
 * Atomically increments the like count for a component in Firestore.
 * Uses a transaction to ensure data consistency.
 * @param {string} componentId - The ID of the component to like.
 * @returns {Promise<number>} - The updated total like count.
 */
export async function incrementLike(componentId: string) {
  if (!db) {
    throw new Error('Database not initialized');
  }
  try {
    console.log(`[Firebase] Incrementing like for: ${componentId}`);
    const docRef = db.collection(LIKES_COLLECTION).doc(componentId);
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        transaction.set(docRef, { count: 1 });
      } else {
        const newCount = (doc.data()?.count || 0) + 1;
        transaction.update(docRef, { count: newCount });
      }
    });

    const updatedDoc = await docRef.get();
    const finalCount = updatedDoc.data()?.count || 0;
    console.log(`[Firebase] Success! New count for ${componentId}: ${finalCount}`);
    return finalCount;
  } catch (error) {
    console.error(`[Firebase Error] incrementLike for ${componentId}:`, error);
    throw new Error('Failed to update likes');
  }
}
