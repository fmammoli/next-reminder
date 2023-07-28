import { initFirestore } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import admin from "firebase-admin";

const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
      : undefined,
  }),
});
const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminDb, adminAuth, firestore };
