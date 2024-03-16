import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "./credentials.json" assert { type: "json" };

// Initialize Firebase
export const firebaseAdminApp = initializeApp({
  credential: cert(serviceAccount),
});

console.log("--------------------------------------------");
console.log("----------- FIREBASE INITIALIZED -----------");
console.log("--------------------------------------------");
