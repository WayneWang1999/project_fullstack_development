const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Menu = require('../models/menu');
const Order = require('../models/order');
const Owner = require('../models/owner');
const Image = require('../models/image');


/****************************************************************************************************************************** */

const getMenuItems = async () => {
    try {
        const menuItems = await Menu.find({inStock:true}).populate('menu_images_url');
        
        return menuItems.map(item => ({
            id: item._id.toString(),
            name: item.name,
            sku: item.sku,
            description: item.description,
            price: item.price,
            inStock: item.inStock,
            image: item.menu_images_url ? {
                id: item.menu_images_url._id,
                contentType: item.menu_images_url.img.contentType,
                data: item.menu_images_url.img.data.toString('base64'),
            } : null,
        }));
    } catch (error) {
        throw new Error('Error fetching menu items');
    }
};

//main page
router.get('/', async (req, res) => {

    const owners = await Owner.find();

    // The Owners collection has only one document and can only be modified
    const owner = owners[0];
    const restaurant_name = owner.restaurant_name;

    const menuItems = await getMenuItems();

    // Pass the menu items and the restaurant name to the main page
    res.render('restaurant/index', {menuItems, restaurant_name});

});

router.get('/order', async (req, res) => {

    const menuItems = await getMenuItems();
    res.render('restaurant/order_form', {menuItems});

});


// Get order status by order ID
router.get('/orders/:id/status', async (req, res) => {
    const orderId = req.params.id;


    try {
        if (!isValidHex24(orderId)) {
            res.status(404).json({ message: 'Invalid confirmation number' });
        }
        else {
            // Retrieve only the orderStatus field
            const order = await Order.findById(orderId, 'orderStatus');

            if (order) {
                res.json({ orderStatus: order.orderStatus });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving order status', error });
    }
});

function isValidHex24(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9a-fA-F]+$/.test(str);
}

// Create Order, upsert Customer
router.post('/orders', async (req, res) => {
    const { customerData, delivery_Address, order_Menus, totalPrice } = req.body;

    try {
        const upsertCustomer = await Customer.findOneAndUpdate(
            { email: customerData.email },
            { $set: customerData },
            { new: true, upsert: true }
        );

        const newOrder = new Order({
            customer: upsertCustomer._id,
            delivery_Address,
            order_Menus: JSON.parse(order_Menus), // Parse the string back to an array
            totalPrice,
        });

        await newOrder.save();

        const jsonData = {
            confirmationNumber: newOrder._id.toString(),
            menuItems: JSON.parse(order_Menus),
            totalPrice: totalPrice
        };
        const queryParams = encodeURIComponent(JSON.stringify(jsonData));
        res.redirect(302, `/restaurant/order_confirmation?data=${queryParams}`);


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order or customer', error });
    }
});

router.get('/order_confirmation', async (req, res) => {
     const { data } = req.query;
    
     let confirmationData;
     if (data) {
         confirmationData = JSON.parse(decodeURIComponent(data));
     }


    res.render('restaurant/order_confirmation', {confirmationData});

});


module.exports = router;
