import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocs, updateDoc, DocumentReference } from 'firebase/firestore';

export const saveColoniesToServer = async (colonies, userId) => {
    try {
      console.log("colonies ", colonies, "userId ", userId)
      const firestore = getFirestore();
  
      // Reference to the specific user's document
      const userDocRef = doc(firestore, 'users', userId);
  
      // Reference to the "colonies" subcollection under the user's document
      const coloniesCollection = collection(userDocRef, 'colonies');
  
      // Iterate over colonies and save them to the "colonies" subcollection
      const colonyReferences = await Promise.all(
        colonies.map(async (colony) => {
          // Add the colony document to the "colonies" subcollection and get its reference
          const colonyDocRef = await addDoc(coloniesCollection, {
            ...colony,
            timestamp: serverTimestamp(), // Include a timestamp if needed
          });
  
          // Return the DocumentReference
          return colonyDocRef;
        })
      );
  
      console.log("COLONY REFERENCES ", colonyReferences)
      // Update the user document with references to the added colonies
      await updateDoc(userDocRef, {
        colonies: colonyReferences,
      });
  
      localStorage.setItem('userColonies', JSON.stringify(colonies));
      console.log('Colonies saved to the server!', colonies);
  
      // Return the colonyReferences array
      return colonyReferences;
    } catch (error) {
      console.error('Error saving colonies:', error);
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