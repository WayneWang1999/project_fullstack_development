//This route is render a html to the views ejs .
const express = require('express');
const router = express.Router();

//Import the models
const Customer = require('../models/customer');
const Driver = require('../models/driver');
const Menu = require('../models/menu');
const Order = require('../models/order');
const Owner = require('../models/owner');
/********************************************************************************************************* */
//login and main page
router.get('/', async (req, res) => {

    if (req.session.hasOwnProperty("loggedInUser") === true) {
        // If login is successful, fetch the data
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');

        // Render the owner's dashboard or a layout with fetched data
        return res.render('owners/layout', { orders });

    }
    res.render('owners/login');
});

router.get('/logout', async (req, res) => {

    req.session.destroy()
    console.log("LOGGED OUT!!! Redirecting you back to the / endpoint")
    return res.redirect("/owner")

});

//user login check function
//const bcrypt = require('bcrypt'); // Make sure bcrypt is required

router.post('/login', async (req, res) => {
    console.log("Login attempt received");


    const { email, password } = req.body;

    try {

        // Check if a user with the provided email exists
        const owner = await Owner.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (!owner) {
            // Return error if no user with the given email
            return res.status(400).render('owners/login', { error: 'Invalid email' });
        }

        // Compare the provided password with the stored hashed password
        if (password !== owner.password) {  // Fixed from user.password to owner.password
            return res.status(400).render('owners/login', { error: 'Invalid email or password' });
        }
        //add userSession if need to use .
        const userSession = { email, password };
        req.session.loggedInUser = userSession;


        // If login is successful, fetch the data
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');

        // Render the owner's dashboard or a layout with fetched data
        return res.render('owners/layout', { orders });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/orders/:id/view', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('customer').populate('driver').populate('order_Menus.menu');

    res.render('owners/order_view.ejs', { order });
});
// router.get('/orders/:id/edit', async (req, res) => {
//     const order = await Order.findById(req.params.id).populate('customer').populate('driver');

//     res.render('owners/order_edit.ejs',{order});
// });

router.post('/orders/:id/edit', async (req, res) => {
    try {

        console.log(req.params.id)
        const orderId = req.params.id;
        //const {orderStatus } = req.body; // Get orderId and new orderStatus from the form
        const { orderStatus } = { orderStatus: "Ready for Delivery" };
        // Update the order's status in the database
        await Order.findByIdAndUpdate(orderId, { orderStatus: orderStatus });
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');
        //const menus = await Menu.find();
        // Render the owner's dashboard or a layout with fetched data
        res.render('owners/layout', { orders });

    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/menu', async (req, res) => {
    const owners = await Owner.find().populate('restaurant_menus');
    res.render('owners/owner_view', { owners });
});
router.get('/info/edit', async (req, res) => {
    const owners = await Owner.find().populate('restaurant_menus');
    res.render('owners/owner_edit', { owners });
});

router.post('/info/update', async (req, res) => {
    const { ownerId, firstName, lastName, email, password, restaurant_name } = req.body;

    // Update the owner in the database
    await Owner.findByIdAndUpdate(ownerId, {
        firstName,
        lastName,
        email,
        password, // Make sure to hash the password if necessary
        restaurant_name
    });

    // Redirect or respond after updating
    res.redirect('/owner/menu'); // Change this to where you want to redirect
});

router.get('/menu/:id/edit', async (req, res) => {
    try {
        console.log(req.params.id)
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).send('Menu not found');
        }
        res.render('owners/menu_edit', { menu }); // Change 'menus' to 'menu'
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/menu/update', async (req, res) => {
    const { menuId, name, description, price, inStock, menu_images_url } = req.body;

    try {
        // Update the menu item in the database
        await Menu.findByIdAndUpdate(menuId, {
            name,
            description,
            price,
            inStock, // Ensure the correct value type for inStock (boolean)
            menu_images_url
        });

        // Redirect after successfully updating
        res.redirect('/owner/menu'); // Redirect to the desired page after update
    } catch (error) {
        console.error('Error updating menu:', error);
        res.status(500).send('An error occurred while updating the menu.');
    }
});

module.exports = router;

