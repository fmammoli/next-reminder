import { initFirestore } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import admin from "firebase-admin";

const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? JSON.parse(JSON.stringify(process.env.FIREBASE_ADMIN_PRIVATE_KEY))
      : undefined,
  }),
});

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth, firestore };
