import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    try {
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Missing Firebase environment variables');
      }
      
      console.log(`[Firebase] Initializing for project: ${process.env.FIREBASE_PROJECT_ID}`);
      
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('[Firebase] Initialization successful');
    } catch (error) {
      console.error('[Firebase] Initialization failed:', error);
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = admin.firestore();
