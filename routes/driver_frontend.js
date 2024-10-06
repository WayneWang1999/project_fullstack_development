//This route is render a html to the views ejs .
const express = require('express');
const router = express.Router();

//Import the models
const Customer = require('../models/customer');
const Driver = require('../models/driver');
const Menu = require('../models/menu');
const Order = require('../models/order');
const Owner = require('../models/owner');

/*************************************************************************************************************** */
//login and main page
router.get('/', async (req, res) => {
    res.render('drivers/login');
});



module.exports = router;