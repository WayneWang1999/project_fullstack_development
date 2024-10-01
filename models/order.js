const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    delivery_Address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    orderDate: {type:Date},
    totalPrice: Number,
    orderStatus: { type: String, enum: ['Ready for Delivery', 'In Transit', 'Delivered'], default: 'Ready for Delivery' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    delivered_image_url:{type: String, required: false},
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);