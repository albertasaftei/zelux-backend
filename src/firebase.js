import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./credentials.json" assert { type: "json" };

// Initialize Firebase
export const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApp();

console.log("Firebase initialized");
