'use server';

import { db } from '@/lib/firebase-admin';

const LIKES_COLLECTION = 'component_likes';

export async function getLikes(componentId: string) {
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

export async function incrementLike(componentId: string) {
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
    // Explicitly check for private key presence
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      console.error('[Firebase Error] FIREBASE_PRIVATE_KEY is missing!');
    }
    throw new Error('Failed to update likes');
  }
}
