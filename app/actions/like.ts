'use server';

import { db } from '@/lib/firebase-admin';

const LIKES_COLLECTION = 'stats';
const GLOBAL_LIKES_DOC = 'global';

export async function getLikes() {
  try {
    const doc = await db.collection(LIKES_COLLECTION).doc(GLOBAL_LIKES_DOC).get();
    if (!doc.exists) {
      return 0;
    }
    return doc.data()?.count || 0;
  } catch (error) {
    console.error('Error fetching likes:', error);
    return 0;
  }
}

export async function incrementLike() {
  try {
    const docRef = db.collection(LIKES_COLLECTION).doc(GLOBAL_LIKES_DOC);
    
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
    return updatedDoc.data()?.count || 0;
  } catch (error) {
    console.error('Error incrementing like:', error);
    throw new Error('Failed to update likes');
  }
}
