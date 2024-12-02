const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // Add mongoose
const bcrypt = require('bcrypt'); // Add bcrypt
const jwt = require('jsonwebtoken'); // Add jsonwebtoken
const meals = require('./data/meals'); // Adjust the path as necessary
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection using the connection string from .env
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User ', userSchema); // Create User model

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// Meals API
app.get('/api/meals', (req, res) => {
    res.json(meals);
});

// Sign Up Route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({ username, email, password: hashedPassword });

    try {
        await newUser .save();
        res.status(201).send('User  created successfully');
    } catch (error) {
        res.status(400).send('Error creating user: ' + error.message);
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Add the /login route to serve the login.html file
app.Post('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Adjust the path as necessary
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});