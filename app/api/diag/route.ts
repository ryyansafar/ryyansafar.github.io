import { NextResponse } from 'next/server';
import { getDb, getLastError, getKeyStatus } from '@/lib/firebase-admin';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      projectId: !!process.env.FIREBASE_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    },
    keyStatus: getKeyStatus(),
    firebase: {
      initialized: false,
      error: getLastError(),
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
      diagnostics.firebase.error = getLastError() || 'getDb() returned null';
    }
  } catch (err: any) {
    diagnostics.firebase.error = err.message || 'Unknown runtime error';
  }

  return NextResponse.json(diagnostics);
}
