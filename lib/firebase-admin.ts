import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let lastError: string | null = null;
let keyStatus: any = null;

export function getLastError() { return lastError; }
export function getKeyStatus() { return keyStatus; }

/**
 * Normalizes a PEM key by stripping everything and rebuilding with strict wrapping.
 */
function cleanPEM(key: string, wrap: boolean): string {
  const header = '-----BEGIN PRIVATE KEY-----';
  const footer = '-----END PRIVATE KEY-----';
  
  let body = key
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s/g, '')
    .trim();
    
  if (wrap) {
    const lines = body.match(/.{1,64}/g) || [body];
    body = lines.join('\n');
  }
  
  return `${header}\n${body}\n${footer}\n`;
}

function initializeFirebase() {
  lastError = null;
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Attempt 1: Strict Wrapping (Standard)
    const variants = [
      cleanPEM(privateKey, true),   // Wrapped at 64
      cleanPEM(privateKey, false),  // Single line
      privateKey.replace(/\\n/g, '\n'), // Just unescape
    ];

    for (let i = 0; i < variants.length; i++) {
        try {
            console.log(`[Firebase] Attempting Init variant ${i + 1}`);
            const app = admin.initializeApp({
                credential: admin.credential.cert({
                    project_id: projectId,
                    client_email: clientEmail,
                    private_key: variants[i],
                } as any),
            }, `app-${i}-${Date.now()}`); // Unique name to avoid collisions
            
            keyStatus = { 
                variant: i + 1, 
                keyLength: variants[i].length,
                success: true 
            };
            return app;
        } catch (error: any) {
            lastError = `Variant ${i + 1} Error: ${error.message}`;
        }
    }
  }

  // Local fallback
  try {
    const devFile = fs.readdirSync(process.cwd()).find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'));
    if (devFile) {
        return admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(fs.readFileSync(path.join(process.cwd(), devFile), 'utf8'))),
        });
    }
  } catch (e: any) {}

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
