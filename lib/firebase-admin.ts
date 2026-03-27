import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let lastError: string | null = null;
let keyStatus: any = null;

export function getLastError() { return lastError; }
export function getKeyStatus() { return keyStatus; }

function formatPEM(key: string): string {
  // 1. Aggressive unquoting
  let cleaned = key.trim().replace(/^["']|["']$/g, '');
  
  // 2. Multi-level unescaping (Vercel can sometimes double-escape)
  // Replaces \\n with \n repeatedly until no more remain.
  while (cleaned.includes('\\n')) {
    cleaned = cleaned.replace(/\\n/g, '\n');
  }
  
  // 3. Isolate the base64 and re-wrap strictly
  const header = '-----BEGIN PRIVATE KEY-----';
  const footer = '-----END PRIVATE KEY-----';
  
  let body = cleaned
    .replace(header, '')
    .replace(footer, '')
    .replace(/\s/g, ''); 
    
  // 4. Wrap body strictly at 64 chars
  const wrapped = body.match(/.{1,64}/g)?.join('\n') || body;
  
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
        clientEmail,
        rawLength: privateKey.length,
        finalLength: formattedKey.length,
        prefix: formattedKey.substring(0, 30),
      };

      // Use snake_case to perfectly match the Service Account JSON structure
      return admin.initializeApp({
        credential: admin.credential.cert({
          project_id: projectId,
          client_email: clientEmail,
          private_key: formattedKey,
        } as any),
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
