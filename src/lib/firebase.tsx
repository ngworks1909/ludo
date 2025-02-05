// Import the functions you need from the SDKs you need
import { getStorage } from 'firebase/storage'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAKd2nWiPn9r_akkY-beEvbTBBiZjIdmUo",
//   authDomain: "klik-234a9.firebaseapp.com",
//   projectId: "klik-234a9",
//   storageBucket: "klik-234a9.firebasestorage.app",
//   messagingSenderId: "627942018478",
//   appId: "1:627942018478:web:b78aff5586feca44638c3f",
//   measurementId: "G-X0SV410YW5"
// };

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
