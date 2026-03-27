import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let lastError: string | null = null;
let keyStatus: any = null;

export function getLastError() { return lastError; }
export function getKeyStatus() { return keyStatus; }

/**
 * Surgically reconstructs a PEM key from potentially mangled strings.
 * Handles escaped newlines, literal newlines, and missing headers.
 */
function formatPEM(key: string): string {
  // 1. Remove all quotes and whitespace from ends
  let cleaned = key.trim().replace(/^["']|["']$/g, '');
  
  // 2. Unescape \n to real newlines
  cleaned = cleaned.replace(/\\n/g, '\n');
  
  // 3. Isolate the base64 body (remove headers and all whitespace)
  const header = '-----BEGIN PRIVATE KEY-----';
  const footer = '-----END PRIVATE KEY-----';
  
  let body = cleaned
    .replace(header, '')
    .replace(footer, '')
    .replace(/\s/g, ''); // Remove all tabs, spaces, newlines from the body
    
  // 4. Wrap body to 64 chars per line (Standard PEM)
  const wrapped = body.match(/.{1,64}/g)?.join('\n') || body;
  
  // 5. Reassemble with strict headers and trailing newline
  return `${header}\n${wrapped}\n${footer}\n`;
}

function initializeFirebase() {
  lastError = null;
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      const formattedKey = formatPEM(privateKey);
      
      keyStatus = {
        projectId,
        email: clientEmail,
        rawLength: privateKey.length,
        finalLength: formattedKey.length,
        prefix: formattedKey.substring(0, 30), // Should be the header
        hasHeader: formattedKey.includes('-----BEGIN PRIVATE KEY-----'),
      };

      console.log(`[Firebase] Initializing with ENV: ${projectId}`);
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
    } catch (error: any) {
      lastError = `PEM Init Error: ${error.message}`;
      console.error('[Firebase]', lastError);
    }
  }

  // Local fallback
  try {
    const devFiles = fs.readdirSync(process.cwd());
    const devFile = devFiles.find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'));
    if (devFile) {
      const saPath = path.join(process.cwd(), devFile);
      const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
      console.log(`[Firebase] Initializing with local JSON: ${devFile}`);
      return admin.initializeApp({
        credential: admin.credential.cert(sa),
      });
    }
  } catch (e: any) {
    console.warn('[Firebase] JSON fallback skipped:', e.message);
  }

  if (!lastError) lastError = 'No credentials found in ENV or JSON.';
  return null;
}

let dbInstance: admin.firestore.Firestore | null = null;
export function getDb() {
  if (dbInstance) return dbInstance;
  const app = initializeFirebase();
  if (app) dbInstance = app.firestore();
  return dbInstance;
}
export const db = getDb();
