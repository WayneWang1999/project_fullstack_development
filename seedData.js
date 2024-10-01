//This is a mongodb data input tool.Can use it to produce 1 collections:tasks
//This is a individual program,not in the project.

const mongoose = require('mongoose');
require('dotenv').config();

// Import models this begin Captial word is the db collection object.
const Customer = require('./models/customer');
const Driver = require('./models/driver');
const Menu = require('./models/menu');
const Order = require('./models/order');
const Owner = require('./models/owner');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Seed data
// Seed data
// Seed data
const seedData = async () => {
    try {
        // Clear existing data
        await Customer.deleteMany();
        await Driver.deleteMany();
        await Menu.deleteMany();
        await Order.deleteMany();
        await Owner.deleteMany();

        // Create menu data
        const menus = await Menu.create([
            {
                name: 'Fish',
                sku: 'BDJ001',
                description: 'Freshly caught fish',
                price: 79.99,
                inStock: true,
                menu_images_url: ""
            },
            {
                name: 'Bread',
                sku: 'BDJ002',
                description: 'Freshly baked bread',
                price: 5.99,
                inStock: true,
                menu_images_url: ""
            },
            {
                name: 'Beef',
                sku: 'BDJ003',
                description: 'High-quality beef',
                price: 99.99,
                inStock: true,
                menu_images_url: ""
            },
            {
                name: 'Chicken',
                sku: 'BDJ004',
                description: 'Organic chicken',
                price: 49.99,
                inStock: true,
                menu_images_url: ""
            },
        ]);

        // Create customer data first
        const customers = await Customer.create([
            {
                firstName: 'Wayne',
                lastName: 'Wang',
                email: 'wayne@example.com',
                password: '111111',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
            {
                firstName: 'George',
                lastName: 'Potakis',
                email: 'george@example.com',
                password: '111111',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
            {
                firstName: 'Henrique',
                lastName: 'Machitte',
                email: 'henrique@example.com',
                password: '111111',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
        ]);

        // Create order data after customers are created
        const orders = await Order.create([
            {
                customer: customers[0]._id,  // Reference to the first customer
                delivery_Address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
                orderDate: new Date('2024-10-02'),
                totalPrice: 23.3,
                orderStatus: 'Delivered',
                driver: null, // Temporarily null
                delivered_image_url: "",
            },
            {
                customer: customers[1]._id,  // Reference to the second customer
                delivery_Address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
                orderDate: new Date('2024-10-02'),
                totalPrice: 23.3,
                orderStatus: 'Delivered',
                driver: null, // Temporarily null
                delivered_image_url: "",
            },
        ]);

        // Create driver data
        const drivers = await Driver.create([
            {
                firstName: 'Driver_01',
                lastName: 'Machitte',
                email: 'driver01@example.com',
                password: '111111',
                license: "toronto01",
                order: orders[0]._id, // Reference to first order
            },
            {
                firstName: 'Driver_02',
                lastName: 'Machitte',
                email: 'driver02@example.com',
                password: '111111',
                license: "toronto02",
                order: orders[1]._id, // Reference to second order
            },
        ]);

        // Now update orders with driver references
        await Order.updateOne({ _id: orders[0]._id }, { driver: drivers[0]._id });
        await Order.updateOne({ _id: orders[1]._id }, { driver: drivers[1]._id });

        // Create owner data
        const owners = await Owner.create([
            {
                firstName: 'Owner',
                lastName: 'Wang',
                email: 'owner@example.com',
                password: '111111',
                restaurant_name: "Noodle Restaurant",
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
        ]);

        console.log('Seed data created successfully');
    } catch (error) {
        console.error('Error creating seed data:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run the seed function
seedData();