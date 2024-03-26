import { initializeApp, cert } from "firebase-admin/app";

const credentials = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};

console.log("credentials", credentials);

// Initialize Firebase
export const firebaseAdminApp = initializeApp({
  credential: cert(credentials),
});

console.log("--------------------------------------------");
console.log("----------- FIREBASE INITIALIZED -----------");
console.log("--------------------------------------------");
