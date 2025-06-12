// Client-side Firebase initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Import Firebase Admin SDK for server-side operations
import admin from 'firebase-admin';
import path from 'path';

// Your web app's Firebase configuration (client-side)
const firebaseConfig = {
  apiKey: "AIzaSyBTsZhODnVYMBQZ3LHFL6iHs7WG0cwbFN4",
  authDomain: "test-5fd83.firebaseapp.com",
  projectId: "test-5fd83",
  storageBucket: "test-5fd83.firebasestorage.app",
  messagingSenderId: "1023392310465",
  appId: "1:1023392310465:web:d7db1d89f61c507c78e040",
  measurementId: "G-HW4098PWTW"
};

// Initialize client-side Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Server-side Firebase Admin initialization
// Path to your service account JSON file
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
  path.resolve(__dirname, '../../serviceAccountKey.json');

// Initialize Firebase Admin SDK
let firebaseAdmin: admin.app.App;

// Check if an app is already initialized to prevent multiple initializations
if (!admin.apps.length) {
  try {
    // Initialize with service account JSON file
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      databaseURL: `https://test-5fd83.firebaseio.com`
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
} else {
  firebaseAdmin = admin.app();
}

export { app, firebaseAdmin };