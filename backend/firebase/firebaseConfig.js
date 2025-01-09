import { initializeApp } from '@firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config (replace with your Firebase project's configuration)
const firebaseConfig = {
   apiKey: "AIzaSyCtTgBDMbB2n2aNKvHHot45H1-ZG3OT10c",
  authDomain: "bpts-bf680.firebaseapp.com",
  projectId: "bpts-bf680",
  storageBucket: "bpts-bf680.firebasestorage.app",
  messagingSenderId: "26515256858",
  appId: "1:26515256858:web:e9de1d410c7c70947383a3",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { db, storage };
