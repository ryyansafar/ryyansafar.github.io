import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let _app: admin.app.App | null = null;
let _db: admin.firestore.Firestore | null = null;

function initializeFirebase(): admin.app.App | null {
  // Return cached app if already initialised
  if (_app) return _app;

  // ── Option 1: Full service account JSON as one env var (simplest Vercel setup) ──
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    try {
      const cred = JSON.parse(rawJson);
      _app = admin.initializeApp({ credential: admin.credential.cert(cred) });
      console.log('[Firebase] Initialized via FIREBASE_SERVICE_ACCOUNT_JSON');
      return _app;
    } catch (e: any) {
      console.error('[Firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
    }
  }

  // ── Option 2: Split env vars (FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY) ──
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Try multiple key formats because Vercel can serialize \n differently
    const candidates = [
      privateKey.replace(/\\n/g, '\n'),          // unescape literal \n
      cleanPEM(privateKey, true),                // strict 64-char wrapping
      cleanPEM(privateKey, false),               // unwrapped single line
    ];

    for (let i = 0; i < candidates.length; i++) {
      try {
        _app = admin.initializeApp(
          { credential: admin.credential.cert({ project_id: projectId, client_email: clientEmail, private_key: candidates[i] } as any) },
        );
        console.log(`[Firebase] Initialized via split env vars (key variant ${i + 1})`);
        return _app;
      } catch (e: any) {
        console.warn(`[Firebase] Split env key variant ${i + 1} failed:`, e.message);
        // If app was partially registered, clean it up before next attempt
        try { admin.app().delete(); } catch {}
        _app = null;
      }
    }
    console.error('[Firebase] All key variants failed. Check FIREBASE_PRIVATE_KEY in Vercel env vars.');
  }

  // ── Option 3: Local dev — service account JSON file in project root ──
  try {
    const files = fs.readdirSync(process.cwd());
    const devFile = files.find(f => f.startsWith('rybo-components-firebase-adminsdk') && f.endsWith('.json'));
    if (devFile) {
      const cred = JSON.parse(fs.readFileSync(path.join(process.cwd(), devFile), 'utf8'));
      _app = admin.initializeApp({ credential: admin.credential.cert(cred) });
      console.log('[Firebase] Initialized via local service account file (dev only)');
      return _app;
    }
  } catch (e: any) {
    console.warn('[Firebase] Local file fallback failed:', e.message);
  }

  console.error('[Firebase] No credentials found. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in Vercel.');
  return null;
}

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
    body = (body.match(/.{1,64}/g) || [body]).join('\n');
  }
  return `${header}\n${body}\n${footer}\n`;
}

export function getDb(): admin.firestore.Firestore | null {
  if (_db) return _db;
  const app = initializeFirebase();
  if (app) {
    _db = app.firestore();
  }
  return _db;
}

// Eagerly initialise on module load so the first request isn't slow
export const db = getDb();
