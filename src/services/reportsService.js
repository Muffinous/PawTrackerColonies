import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocs, getDoc, updateDoc, DocumentReference } from 'firebase/firestore';

// Function to get colonies from the server
export const getReportsFromServer = async () => {
    try {
        // Initialize Firestore
        const firestore = getFirestore();

        // Reference to the "colonies" collection
        const reportsCollection = collection(firestore, 'reports');

        // Get all documents in the "colonies" collection
        const querySnapshot = await getDocs(reportsCollection);

        // Extract the data from the documents
        const reportsData = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID
            ...doc.data(), // Include the document data
        }));

        console.log('Colonies retrieved from the server:', reportsData);

        return reportsData;
    } catch (error) {
        console.error('Error getting colonies:', error);
        return [];
    }
};

export const getReportByIdFromServer = async (reportId) => {
    try {
        const firestore = getFirestore();
        const reportDocRef = doc(firestore, 'reports', reportId);
        const reportDocSnapshot = await getDoc(reportDocRef);

        if (reportDocSnapshot.exists()) {
            const reportData = {
                id: reportDocSnapshot.id,
                ...reportDocSnapshot.data(),
            };
            console.log('Report retrieved from the server:', reportData);
            return reportData;
        } else {
            console.error('Report not found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting report by ID:', error);
        return null;
    }
};