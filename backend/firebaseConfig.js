// firebaseConfig.js
// import { firebase } from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyCNBtOJqXJXiSbEZLO83DJ1oq2etkKUbI4",
//     authDomain: "bpts-34c54.firebaseapp.com",
//     projectId: "bpts-34c54",
//     storageBucket: "bpts-34c54.appspot.com",
//     messagingSenderId: "320960896346",
//     appId: "1:320960896346:web:7cb35f9324c9c2d7a7a763",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export { firebase };
// firebase.js
// firebaseConfig.js

// Import the necessary Firebase modules
import { initializeApp } from '@firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config (replace with your Firebase project's configuration)
const firebaseConfig = {
    apiKey: "AIzaSyCNBtOJqXJXiSbEZLO83DJ1oq2etkKUbI4",
    authDomain: "bpts-34c54.firebaseapp.com",
    projectId: "bpts-34c54",
    storageBucket: "bpts-34c54.appspot.com",
    messagingSenderId: "320960896346",
    appId: "1:320960896346:web:7cb35f9324c9c2d7a7a763",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { db, storage };
