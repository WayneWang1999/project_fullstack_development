const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;


const app = express();

// Middleware
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

//use the Ejs to show the layout and html
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

const restaurantRouters = require('./routes/restaurant_frontend');
app.use('/restaurant', restaurantRouters);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});