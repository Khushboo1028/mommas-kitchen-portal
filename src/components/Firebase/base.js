import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import 'firebase/firebase-storage';

require('dotenv').config();

const FirebaseApp = firebase.initializeApp({
    // apiKey: process.env.API_KEY,
    // authDomain: process.env.AUTH_DOMAIN,
    // databaseURL: process.env.DATABASE_URL,
    // projectId: process.env.PROJECT_ID,
    // storageBucket: process.env.STORAGE_BUCKET,
    // messagingSenderId: process.env.MESSAGING_SENDER_ID,
    // appId: process.env.APP_ID,
    // measurementId: process.env.MEASUREMENT_ID

    apiKey: "AIzaSyAYAoAxRs_FvQGIWaIUg8mYla0ceYUZbls",
    authDomain: "momma-s-kitchen.firebaseapp.com",
    databaseURL: "https://momma-s-kitchen.firebaseio.com",
    projectId: "momma-s-kitchen",
    storageBucket: "momma-s-kitchen.appspot.com",
    messagingSenderId: "803468800193",
    appId: "1:803468800193:web:e09ddc6a2b0cda8fcea440",
    measurementId: "G-VRNTPT8TP9"


});
export default FirebaseApp;

