//This route is render a html to the views ejs .
const express = require('express');
const router = express.Router();
// Import models
const Customer = require('../models/customer');
const Driver = require('../models/driver');
const Menu = require('../models/menu');
const Order = require('../models/order');
const owner = require('../models/owner');

/****************************************************************************************************************************** */
//login and main page
router.get('/', async (req, res) => {
    res.render('customers/login');
});



module.exports = router;