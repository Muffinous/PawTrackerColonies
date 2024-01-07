// userService.js

import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig'; // Adjust the path based on your project structure
import { initializeApp } from 'firebase/app';

// Initialize Firebase (if not already initialized)
try {
    const firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase initialized", firebaseApp);
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

const firestore = getFirestore();

export const getUserById = async (userId) => {
    try {
        const usersCollection = collection(firestore, 'users');
        const userDocRef = doc(usersCollection, userId);
        const userDocSnapshot = await getDoc(userDocRef);
        const data = userDocSnapshot.data();

        return data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};
