import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 1. Try loading from service account JSON file (Local Desktop Dev)
  const serviceAccountFilename = fs.readdirSync(process.cwd())
    .find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'))
    || 'firebase-service-account.json';
    
  const serviceAccountPath = path.join(process.cwd(), serviceAccountFilename);
  
  if (fs.existsSync(serviceAccountPath)) {
    try {
      console.log('[Firebase] Initializing using service account JSON file');
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('[Firebase] Failed to load JSON file, falling back to ENV:', error);
    }
  }

  // 2. Fallback to Environment Variables (Vercel Prod)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !privateKey || !clientEmail) {
    console.error('[Firebase] Environment variables not found. Disabling persistence.');
    return null;
  }

  try {
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    const formattedKey = privateKey.replace(/\\n/g, '\n');

    console.log(`[Firebase] Initializing using ENV for: ${projectId}`);
    
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

const app = initializeFirebase();
export const getDb = () => (app ? admin.firestore() : null);
export const db = getDb();
export const isFirebaseReady = () => !!app;
