import { Timestamp } from "firebase/firestore";
import User from "./User";
import Colony from "./Colony";
import { Cat } from "./Cat";

interface ColonyReport {
  id?: string;
  colony: Colony;
  catsMissing: string[];
  catsFed: CatFedEntry[];
  catDescriptions: { [key: number]: string }; // Assuming you're using cat IDs as keys for descriptions
  user: User;
  datetime: Timestamp;
  // Add other properties as needed
}

interface CatFedEntry {
  catId: string;
  description: string;
  cat: Cat;
}

export default ColonyReport;
