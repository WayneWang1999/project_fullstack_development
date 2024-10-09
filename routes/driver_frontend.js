//This route is render a html to the views ejs .
const express = require('express');
const router = express.Router();

//Import the models
const Customer = require('../models/customer');
const Driver = require('../models/driver');
const Menu = require('../models/menu');
const Order = require('../models/order');
const Owner = require('../models/owner');
const Image=require('../models/image')

const fs = require('fs'); // Add this line to use the File System module

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
        //If login is successful,add userSession keep the login untill logout .
        const userSession = { email, password };
        req.session.loggedInUser = userSession;
        //  fetch the order data
        const orders = await Order.find().populate('customer').populate('driver').populate('delivered_image_url');


        // Render the owner's dashboard to a layout with fetched data
        return res.render('drivers/layout', { orders });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// to view orders
router.get('/orders/:id/view', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('customer').populate('driver').populate('delivered_image_url');

    res.render('drivers/order_view.ejs', { order });
});
router.post('order/:id/update')

//****************************************************************************************************************** */

router.post('/orders/:id/update_accept', async (req, res) => {
    try {
        const { orderStatus } = req.body; // Get orderStatus from the form
        // Update the order's status in the database

        const driver = await Driver.findOne({ email: req.session.loggedInUser.email });

        await Order.findByIdAndUpdate(req.params.id,
            {
                orderStatus: orderStatus,
                driver: driver._id,
            }, { new: true, runValidators: true }
        );
        const orders = await Order.find().populate('customer').populate('driver').populate('delivered_image_url');
        // Render the owner's dashboard or a layout with fetched data
        res.render('drivers/layout', { orders });

    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).send('Internal Server Error');
    }
});

// for the upload file

const multer = require('multer');

// Configure storage settings for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

// Initialize the upload middleware
const upload = multer({ storage: storage });


router.post('/orders/:id/update_finish', upload.single('orderImage'), async (req, res) => {
    try {
        const { orderStatus } = req.body; // Get orderStatus from the form
        
        // Check if an image file was uploaded
        let imagePath = null;
        let newImage = null;

        if (req.file) {
            // Create a new image instance
            newImage = new Image({
                name: req.file.filename, // The file name saved by multer
                desc: 'Uploaded image',
                img: {
                    data: fs.readFileSync(req.file.path), // File path stored
                    contentType: req.file.mimetype // Content type, e.g., image/png
                }
            });
            // Save the new image to the database
            await newImage.save();
        }

        // Update the order's status in the database
        await Order.findByIdAndUpdate(req.params.id, {
            orderStatus: orderStatus,
            delivered_image_url: newImage ? newImage._id : null // Reference the new image ID
        }, { new: true, runValidators: true });

        // Fetch updated orders including populated fields
        const orders = await Order.find()
            .populate('customer')
            .populate('driver')
            .populate('delivered_image_url'); // Use the correct field name

        // Render the owner's dashboard or a layout with fetched data
        res.render('drivers/layout', { orders });

    } catch (err) {
        console.error('Error updating order status or uploading image:', err);
        res.status(500).send('Internal Server Error');
    }
});

//************************************************************************************************************************* */
module.exports = router;