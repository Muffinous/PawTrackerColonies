// Function to save colonies to the server
export const saveColoniesToServer = async (colonies) => {
    try {
        // Make an HTTP POST request to your server API
        // Replace the URL with your actual API endpoint
        // await fetch('/api/saveColonies', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ colonies }),
        // });

        localStorage.setItem('userColonies', JSON.stringify(colonies));
        console.log('Colonies saved to the server!', colonies);
    } catch (error) {
        console.error('Error saving colonies:', error);
    }
};

// Function to get colonies from the server
export const getColoniesFromServer = async () => {
    try {
        // Make an HTTP GET request to your server API
        // Replace the URL with your actual API endpoint
        //const response = await fetch('/api/getColonies');
        //const data = await response.json();
        const storedColonies = localStorage.getItem('userColonies');

        console.log('Colonies retrieved from the server:', storedColonies);

        return storedColonies;
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
        // Get existing reports from localStorage or initialize an empty array
        const existingReports = JSON.parse(localStorage.getItem('colonyReports')) || [];
    
        // Add the new report to the array
        existingReports.push(report);
    
        // Save the updated array back to localStorage
        localStorage.setItem('colonyReports', JSON.stringify(existingReports));
        console.log('Colony report saved successfully.');
        return true;

      } catch (error) {
        console.error('Error saving colony report:', error.message);
        return false;
      }
};
