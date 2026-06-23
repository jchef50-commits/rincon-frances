import { auth } from '@/app/lib/firebase';
import { signInAnonymously } from 'firebase/auth';

let ensureClientUidPromise: Promise<string | undefined> | null = null;

export async function ensureAnonymousClientUid(): Promise<string | undefined> {
  if (!auth) {
    return undefined;
  }

  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }

  if (!ensureClientUidPromise) {
    ensureClientUidPromise = signInAnonymously(auth)
      .then((credentials) => credentials.user.uid)
      .finally(() => {
        ensureClientUidPromise = null;
      });
  }

  return ensureClientUidPromise;
}
