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
      // 1. Aggressive cleaning of the private key
      let cleanedKey = privateKey.trim();
      
      // Remove surrounding quotes if they exist
      if (cleanedKey.startsWith('"') && cleanedKey.endsWith('"')) {
        cleanedKey = cleanedKey.slice(1, -1);
      }
      
      // Handle both literal escaped \n and real newlines
      // Then ensure every single line ends with a real newline char
      let formattedKey = cleanedKey.replace(/\\n/g, '\n');
      
      // Standardize headers and footers (ensure no missing dashes)
      if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
        formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}`;
      }
      if (!formattedKey.includes('-----END PRIVATE KEY-----')) {
        formattedKey = `${formattedKey}\n-----END PRIVATE KEY-----`;
      }
      
      // Ensure there is a final newline (PEM requirement)
      if (!formattedKey.endsWith('\n')) {
        formattedKey += '\n';
      }

      console.log(`[Firebase] Attempting init for: ${projectId}`);
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
    } catch (error: any) {
      lastError = `ENV Init Error: ${error.message}`;
      console.error('[Firebase]', lastError);
      // Don't return null yet, try JSON fallback just in case
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
