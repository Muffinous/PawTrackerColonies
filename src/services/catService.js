// userService.js

import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig'; // Adjust the path based on your project structure
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const auth = getAuth();

// Initialize Firebase (if not already initialized)

export const getCatById = async (catId) => {
    console.log("CATS ID ", catId)
    try {
        const catsCollection = collection(firestore, 'cats');
        const catDocRef = doc(catsCollection, catId);
        const catDocSnapshot = await getDoc(catDocRef);
        const data = catDocSnapshot.data();

        return data;
    } catch (error) {
        console.error('Error fetching cat by ID:', error);
        throw error;
    }
};
