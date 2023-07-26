import admin from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../service-account.json";

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const auth = getAuth();
