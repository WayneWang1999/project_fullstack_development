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

router.get('/driver/signUp', async (req, res) => {
    res.render('/driver/signUp.ejs');
});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        // Check if a user with the provided email exists
        const driver = await Driver.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (!driver) {
            // Return error if no user with the given email
            return res.status(400).render('drivers/login', { error: 'Invalid email' });
        }
    ;

        //  fetch the order data
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');


        // Render the owner's dashboard to a layout with fetched data
        return res.render('drivers/layout', { orders });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// to view orders
router.get('/orders/:id/view', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('customer').populate('driver').populate('order_Menus.menu');

    res.render('drivers/order_view.ejs', { order });
});
router.post('order/:id/update')


module.exports = router;