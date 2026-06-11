import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

// Firebase uygulamasını dışa aktararak başlatıyoruz
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Veritabanı (db) bağlantısını sayfaların kullanabilmesi için dışa aktarıyoruz
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export function initializeFirebase() {
  return { firebaseApp, firestore: db, auth };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './firestore/use-memo-firebase';
export * from './error-emitter';
export * from './errors';
