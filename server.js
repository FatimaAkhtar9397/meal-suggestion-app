const express = require('express');
const path = require('path');
const meals = require('./data/meals'); // Import the meals data

const app = express();
const PORT = 3000;



// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get meals
app.get('/api/meals', (req, res) => {
    res.json(meals);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});