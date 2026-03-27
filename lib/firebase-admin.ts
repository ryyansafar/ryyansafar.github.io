import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let lastError: string | null = null;
let keyStatus: any = null;

export function getLastError() { return lastError; }
export function getKeyStatus() { return keyStatus; }

function initializeFirebase() {
  lastError = null;
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // 1. Isolate the base64 content
      let raw = privateKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/\n| \r| /g, '')
        .replace(/"/g, '')
        .trim();

      keyStatus = {
        length: raw.length,
        prefix: raw.substring(0, 10),
        suffix: raw.substring(raw.length - 10),
      };

      // 2. Wrap at 64 characters (Standard PEM requirement)
      const lines = [];
      for (let i = 0; i < raw.length; i += 64) {
        lines.push(raw.substring(i, i + 64));
      }
      const wrappedBase64 = lines.join('\n');

      // 3. Reconstruct with standard headers
      const formattedKey = `-----BEGIN PRIVATE KEY-----\n${wrappedBase64}\n-----END PRIVATE KEY-----\n`;

      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
    } catch (error: any) {
      lastError = `PEM Wrap Error: ${error.message}`;
      console.error('[Firebase]', lastError);
    }
  }

  // Local fallback
  try {
    const devFile = fs.readdirSync(process.cwd()).find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'));
    if (devFile) {
      const saPath = path.join(process.cwd(), devFile);
      return admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
      });
    }
  } catch (e) {}

  if (!lastError) lastError = 'No credentials found.';
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
