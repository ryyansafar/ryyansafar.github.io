import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

/**
 * Enhanced Firebase Initialization for Vercel + Local Dev.
 * Prioritizes Environment Variables for production safety.
 */
function initializeFirebase() {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Case 1: ENV variables (Vercel Production)
  if (projectId && clientEmail && privateKey) {
    try {
      // Clean up private key (Vercel can mangle newlines or add extra quotes)
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      const formattedKey = privateKey.replace(/\\n/g, '\n');

      console.log(`[Firebase] Init using ENV: ${projectId}`);
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
    } catch (error: any) {
      console.error('[Firebase] ENV Init Error:', error.message);
    }
  }

  // Case 2: Service Account JSON (Local Dev fallback)
  const devFile = fs.readdirSync(process.cwd())
    .find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'));
    
  if (devFile) {
    try {
      const saPath = path.join(process.cwd(), devFile);
      console.log(`[Firebase] Init using local JSON: ${devFile}`);
      return admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
      });
    } catch (error: any) {
      console.error('[Firebase] JSON Init Error:', error.message);
    }
  }

  console.error('[Firebase] No valid credentials found (ENV or JSON).');
  return null;
}

let dbInstance: admin.firestore.Firestore | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  
  const app = initializeFirebase();
  if (app) {
    dbInstance = app.firestore();
    return dbInstance;
  }
  
  return null;
}

export const db = getDb();
export const isFirebaseReady = () => !!getDb();
