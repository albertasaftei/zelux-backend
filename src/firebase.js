import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import serviceAccount from "./credentials.json" assert { type: "json" };

// Initialize Firebase
export const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApp();

console.log("Firebase initialized");
