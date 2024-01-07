import { DocumentReference, Timestamp } from "firebase/firestore";
import Colony from "./Colony";
import User from "./User";

interface ColonyReport {
    id: string;
    name: string;
    colony: Colony;
    catsMissing: Cat[];
    catsFed: Cat[];
    catDescriptions: { [key: number]: string }; // Assuming you're using cat IDs as keys for descriptions
    user: User;
    datetime: Timestamp;
    // Add other properties as needed
  }
  
  export default ColonyReport;
  