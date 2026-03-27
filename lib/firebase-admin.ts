import admin from 'firebase-admin';

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !privateKey || !clientEmail) {
    console.error('[Firebase] Environment variables not found. Disabling persistence.');
    return null;
  }

  try {
    // 1. Unquote if necessary
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
      privateKey = privateKey.slice(1, -1);
    }

    // 2. Normalize newlines: handle both escaped \n and literal newlines
    const formattedKey = privateKey.replace(/\\n/g, '\n');

    console.log(`[Firebase] Booting for: ${projectId}`);
    
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    });
  } catch (error) {
    console.error('[Firebase] Critical Init Error:', error);
    return null;
  }
}

// Global instance (may be null if init fails)
const app = initializeFirebase();

/**
 * Safe database getter. Use this instead of direct export in case of init failure.
 */
export const getDb = () => {
  if (!app) return null;
  return admin.firestore();
};

export const db = getDb();
export const isFirebaseReady = () => !!app;
