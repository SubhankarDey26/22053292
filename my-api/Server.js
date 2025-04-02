const express = require("express");
const { getAuthToken } = require("./getAuthToken");
const app = express();
const port = 3000;

app.use(express.json());

// Middleware to verify authorization token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    
    // For simplicity, we're just checking if a token exists
    // In a real implementation, you would validate the token
    next();
};

// Calculator endpoint
app.post("/calculate/average", verifyToken, (req, res) => {
    const { numbers } = req.body;
    
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: "Please provide an array of numbers" });
    }
    
    const startTime = new Date();
    
    // Calculate average
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const average = sum / numbers.length;
    
    // Simulate some processing time
    setTimeout(() => {
        const endTime = new Date();
        const responseTime = endTime - startTime;
        
        res.status(200).json({
            result: average,
            responseTime: `${responseTime}ms`
        });
    }, 100); // Adding a small delay to simulate processing
});

// Start server
app.listen(port, () => {
    console.log(`Calculator API running on http://localhost:${port}`);
});