const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    restaurant_name:{type: String, required: true },
    restaurant_address:{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },

}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);