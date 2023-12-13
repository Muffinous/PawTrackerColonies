interface ColonyReport {
    id: number;
    name: string;
    missingAnimals: Cat[];
    fedAnimals: Cat[];
    catDescriptions: { [key: number]: string }; // Assuming you're using cat IDs as keys for descriptions
    // Add other properties as needed
  }
  
  export default ColonyReport;
  