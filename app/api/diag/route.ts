import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  // Protect with secret token — set DIAG_SECRET in Vercel env vars
  const secret = process.env.DIAG_SECRET;
  if (secret) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasServiceAccountJson: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    },
    firebase: {
      initialized: false,
      error: null,
    }
  };

  try {
    const db = getDb();
    if (db) {
      diagnostics.firebase.initialized = true;
      const test = await db.collection('component_likes').limit(1).get();
      diagnostics.firebase.readSuccess = true;
      diagnostics.firebase.docCount = test.size;
    } else {
      diagnostics.firebase.error = 'getDb() returned null — check env vars';
    }
  } catch (err: any) {
    diagnostics.firebase.error = err.message || 'Unknown runtime error';
  }

  return NextResponse.json(diagnostics);
}
