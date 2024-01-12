import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc, DocumentReference } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getCatById } from './catService';
const auth = getAuth();

export const saveColoniesToServer = async (colonyIds, userId) => {
    try {
        const firestore = getFirestore();

        // Reference to the specific user's document
        const userDocRef = doc(firestore, 'users', userId);

        // Update the user document with the array of colony IDs
        await updateDoc(userDocRef, {
            colonies: colonyIds,
        });

        localStorage.setItem('userColonies', JSON.stringify(colonyIds));

        // Return the colonyIds array
        return colonyIds;
    } catch (error) {
        console.error('Error saving colony IDs:', error);
        throw error; // Propagate the error
    }
};

// Function to get colonies from the server
export const getColoniesFromServer = async () => {
    try {
        // Initialize Firestore
        const firestore = getFirestore();

        // Reference to the "colonies" collection
        const coloniesCollection = collection(firestore, 'colonies');

        // Get all documents in the "colonies" collection
        const querySnapshot = await getDocs(coloniesCollection);

        // Extract the data from the documents
        const coloniesData = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID
            ...doc.data(), // Include the document data
        }));

        console.log('Colonies retrieved from the server:', coloniesData);

        return coloniesData;
    } catch (error) {
        console.error('Error getting colonies:', error);
        return [];
    }
};

export const getColoniesByIdFromServer = async (colonyId) => {
    try {
        // Initialize Firestore
        const firestore = getFirestore();

        // Reference to the "colonies" collection
        const coloniesCollection = collection(firestore, 'colonies');

        // Get all documents in the "colonies" collection
        const colonyDocRef = doc(coloniesCollection, colonyId);
        const colonyDocSnapshot = await getDoc(colonyDocRef);
        const data = colonyDocSnapshot.data();

        return data
    } catch (error) {
        console.error('Error getting colonies:', error);
        return [];
    }
};

// Function to get colonies from the server
export const getUserColonies = async () => {
    try {
        // Make an HTTP GET request to your server API
        // Replace the URL with your actual API endpoint
        //const response = await fetch(`/api/user/${id}/colonies`);
        //const data = await response.json();
        const storedColonies = localStorage.getItem('userColonies');

        console.log('Colonies retrieved from the server:', storedColonies);

        return storedColonies;
    } catch (error) {
        console.error('Error getting colonies:', error);
        return [];
    }
};

// Function to save colonies to the server
export const saveColoniesUser = async (colonies) => {
    try {
        // Make an HTTP POST request to your server API
        // Replace the URL with your actual API endpoint
        await fetch(`/api/user/${id}/colonies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ colonies }),
        });

        localStorage.setItem('userColonies', JSON.stringify(colonies));
        console.log('Colonies saved to the server!', colonies);
    } catch (error) {
        console.error('Error saving colonies:', error);
    }
};

// Function to save colonies to the server
export const saveColonyReport = async (report) => {
    try {
        const firestore = getFirestore();
        // Add a new document with a generated ID to the "reports" collection
        const docRef = await addDoc(collection(firestore, 'reports'), report);

        console.log('Report added with ID: ', docRef.id);
        console.log("Report to save ", report)
        // Get existing reports from localStorage or initialize an empty array
        const existingReports = JSON.parse(localStorage.getItem('colonyReports')) || [];

        // Add the new report to the array
        existingReports.push(report);

        // Save the updated array back to localStorage
        localStorage.setItem('colonyReports', JSON.stringify(existingReports));
        const ereports = JSON.parse(localStorage.getItem('colonyReports'));

        console.log('Colony report saved successfully.', ereports);
        return true;

    } catch (error) {
        console.error('Error saving colony report:', error.message);
        return false;
    }
};

// Function to save colonies to the server
export const getColoniesReports = async () => {
    try {
        // Get existing reports from localStorage or initialize an empty array
        const existingReports = JSON.parse(localStorage.getItem('colonyReports')) || [];

        console.log('Colonies retrieved', existingReports);
        return existingReports;

    } catch (error) {
        console.error('Error saving colony report:', error.message);
        return false;
    }
};

// Function to get cats from one colony
export const getColoniesCats = async (colonyId) => {
    try {
        console.log("buscando cats colony ", colonyId)
        // Initialize Firestore
        const firestore = getFirestore();

        // Reference to the "colonies" collection
        const coloniesCollection = collection(firestore, 'colonies');

        // Get all documents in the "colonies" collection
        const colonyDocRef = doc(coloniesCollection, colonyId);
        const colonyDocSnapshot = await getDoc(colonyDocRef);
        const data = colonyDocSnapshot.data();

        let cats = await fetchCatData(data.cats);

        console.log('getColoniesCats return ', cats);
        return cats;


    } catch (error) {
        console.error('Error getting cats from colony:', error.message);
        return false;
    }

};

const fetchCatData = async (catIds) => {
    const catsData = [];

    for (const catId of catIds) {
        try {
            const catData = await getCatById(catId);
            catData.id = catId;

            if (catData && catData.img) {
                // Fetch download URL for the cat image
                const storage = getStorage();
                const imageRef = ref(storage, catData.img);

                const user = auth.currentUser;
                if (user) {
                    try {
                        // If authenticated, get the download URL with the user's token
                        const imageURL = await getDownloadURL(imageRef);
                        catData.img = imageURL; // Replace the path with the actual URL
                    } catch (error) {
                        console.error('Error fetching download URL:', error);
                        // Handle the error, e.g., display a placeholder image
                        catData.img = 'path/to/placeholder-image.jpg';
                    }
                } else {
                    // If the user is not authenticated, display a placeholder image
                    catData.img = 'path/to/placeholder-image.jpg';
                }
            }

            if (catData) {
                catsData.push(catData);
            }

        } catch (error) {
            console.error("Error fetching cat data:", error);
        }
    }
    return catsData;
};