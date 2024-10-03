//This is the owner website designed by Wayne:
const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;

// Import models
const Customer = require('./models/customer');
const Driver = require('./models/driver');
const Menu = require('./models/menu');
const Order = require('./models/order');
const owner = require('./models/owner');
//define the server
const app = express();
// Middleware
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// setup sessions for login
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

//use the Ejs to show the layout and html
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
//for the form submit
app.use(express.urlencoded({ extended: true }));

//************************************************************************************************************************** */
//mount the router only need to edit this code
const ownerRouters = require('./routes/owner_frontend');
app.use('/owner', ownerRouters);

//*************************************************************************************************************************** */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});