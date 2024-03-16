import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./credentials.json" assert { type: "json" };

// Initialize Firebase
export const firebaseAdminApp = initializeApp({
  credential: cert(serviceAccount),
});
console.log("Firebase initialized");

export const db = getFirestore(firebaseAdminApp);
