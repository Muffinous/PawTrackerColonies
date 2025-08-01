import { Timestamp } from "firebase/firestore";
import ColonyReport from "../models/ColonyReport";

export const getDateValue = (datetime: Timestamp) => {
    const rawDate = datetime;

    if (!rawDate || typeof rawDate !== 'string') return null;

    const date = new Date(rawDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getHoursValue = (datetime: Timestamp) => {
    const rawDate = datetime;

    if (!rawDate || typeof rawDate !== 'string') return null;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return null;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
};
