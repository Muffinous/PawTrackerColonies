import { Timestamp } from "firebase/firestore";
import User from "./User";

interface ColonyReport {
  id?: string;
  colony: string;
  catsMissing: string[];
  catsFed: string[];
  catDescriptions: { [key: number]: string }; // Assuming you're using cat IDs as keys for descriptions
  user: User;
  datetime: Timestamp;
  // Add other properties as needed
}

export default ColonyReport;
