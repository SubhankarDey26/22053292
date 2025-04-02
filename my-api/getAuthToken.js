const axios = require("axios");

const url = "http://20.244.56.144/evaluation-service/auth";

const requestData = {
    "email": "bnk.subhankar@gmail.com",
    "name": "Subhankar Dey",
    "rollNo": "22053292",
    "accessCode": "nwpwrZ",
    "clientID": "mock-client-id-12345",
    "clientSecret": "mock-secret-key-67890"
};

async function getAuthToken() {
    try {
        const response = await axios.post(url, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Token Type:", response.data.token_type);
        console.log("Access Token:", response.data.access_token);
        console.log("Expires In:", response.data.expires_in);
        
        // Return the token for use in other files
        return response.data.access_token;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Execute if this file is run directly
if (require.main === module) {
    getAuthToken()
        .then(token => console.log("Successfully retrieved token!"))
        .catch(err => console.log("Failed to retrieve token"));
}

// Export the function for use in other files
module.exports = { getAuthToken };