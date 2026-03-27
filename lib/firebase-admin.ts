import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let lastError: string | null = null;

export function getLastError() {
  return lastError;
}

/**
 * Enhanced Firebase Initialization for Vercel + Local Dev.
 * Prioritizes Environment Variables for production safety.
 */
function initializeFirebase() {
  lastError = null;
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Case 1: ENV variables (Vercel Production)
  if (projectId && clientEmail && privateKey) {
    try {
      // 1. Aggressive cleaning: Remove all whitespace and headers/footers
      // We want to isolate just the base64 content
      let raw = privateKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '') // Remove literal \n
        .replace(/\n/g, '')   // Remove real newlines
        .replace(/\r/g, '')   // Remove carriage returns
        .replace(/\s/g, '')   // Remove all spaces/tabs
        .trim();

      // Remove any leftover quotes
      if (raw.startsWith('"')) raw = raw.slice(1);
      if (raw.endsWith('"')) raw = raw.slice(0, -1);

      // 2. Reconstruct the PEM properly
      // We don't even need internal newlines for firebase-admin, 
      // but we MUST have the exact Header/Footer and a trailing newline.
      const formattedKey = `-----BEGIN PRIVATE KEY-----\n${raw}\n-----END PRIVATE KEY-----\n`;

      console.log(`[Firebase] Nuclear Init attempt for: ${projectId} (Key Length: ${raw.length})`);
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
    } catch (error: any) {
      lastError = `Nuclear PEM Error: ${error.message}`;
      console.error('[Firebase]', lastError);
    }
  } else {
    const missing = [];
    if (!projectId) missing.push('PROJECT_ID');
    if (!clientEmail) missing.push('CLIENT_EMAIL');
    if (!privateKey) missing.push('PRIVATE_KEY');
    if (missing.length > 0) lastError = `Missing ENV: ${missing.join(', ')}`;
  }

  // Case 2: Service Account JSON (Local Dev fallback)
  try {
    const devFile = fs.readdirSync(process.cwd())
      .find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'));
      
    if (devFile) {
      const saPath = path.join(process.cwd(), devFile);
      console.log(`[Firebase] Init using local JSON: ${devFile}`);
      return admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
      });
    }
  } catch (error: any) {
    // fs.readdirSync might fail on Vercel, which is fine if we have ENV
    console.warn('[Firebase] JSON check skipped or failed:', error.message);
  }

  if (!lastError) lastError = 'No valid credentials found (ENV or JSON).';
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
