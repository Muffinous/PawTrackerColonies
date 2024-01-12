// coloniesService.d.ts
import Colony from "../types/Colony";
import ColonyReport from "../types/ColonyReport";

export function saveColoniesToServer(colonies: Colony[], userId: string): Promise<Colony[]>;
export function saveColonyReport(report: ColonyReport): boolean;
export function getColoniesFromServer(): Promise<Colony[]>;
export function getColoniesReports(): Promise<ColonyReport[]>;
export function getColoniesCats(colonyId: string): Promise<Cat[]>;
export function getColoniesByIdFromServer(colonyId: string): Promise<Colony>;

// coloniesService.js
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocs, updateDoc } from 'firebase/firestore';
import Colony from '../types/Colony';

export const saveColoniesToServer = async (colonies, userId) => {
    try {
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', userId);
        const coloniesCollection = collection(userDocRef, 'colonies');

        const colonyReferences = await Promise.all(
            colonies.map(async (colony) => {
                const colonyDocRef = await addDoc(coloniesCollection, {
                    ...colony,
                    timestamp: serverTimestamp(),
                });

                return colonyDocRef;
            })
        );

        await updateDoc(userDocRef, {
            colonies: colonyReferences,
        });

        localStorage.setItem('userColonies', JSON.stringify(colonies));

        const savedColonies = await Promise.all(colonyReferences.map(async (colonyRef) => {
            const colonyDocSnapshot = await getDocs(colonyRef);
            const colonyData = colonyDocSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return colonyData[0];
        }));

        console.log('Colonies saved to the server!', savedColonies);

        return savedColonies;
    } catch (error) {
        console.error('Error saving colonies:', error);
        throw error;
    }
};

export const getColoniesFromServer = async () => {
    try {
        const firestore = getFirestore();
        const coloniesCollection = collection(firestore, 'colonies');
        const querySnapshot = await getDocs(coloniesCollection);

        const coloniesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log('Colonies retrieved from the server:', coloniesData);

        return coloniesData;
    } catch (error) {
        console.error('Error getting colonies:', error);
        return [];
    }
};

// Other functions remain unchanged
