// coloniesService.d.ts
import Colony from "../models/Colony";
import ColonyReport from "../models/ColonyReport";

export function getReportsFromServer(): Promise<ColonyReport[]>;

// coloniesService.js
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import Colony from '../models/Colony';

export const getReportsFromServer = async () => {
    try {
        const firestore = getFirestore();
        const reportsCollection = collection(firestore, 'reports');
        const querySnapshot = await getDocs(reportsCollection);

        const reportsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log('Colonies retrieved from the server:', reportsData);

        return coloniesData;
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
// Other functions remain unchanged
