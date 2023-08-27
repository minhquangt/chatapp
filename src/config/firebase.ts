import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCrClEtDd6DLy55HRz4nvN-gvou2uSzl9g',
    authDomain: 'chatapp-811f8.firebaseapp.com',
    projectId: 'chatapp-811f8',
    storageBucket: 'chatapp-811f8.appspot.com',
    messagingSenderId: '812140467596',
    appId: '1:812140467596:web:84f5b549a500c9984bf2a9',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);
