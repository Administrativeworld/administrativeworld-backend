const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    password: { 
        type: String, 
        required: true },
    role: { 
        type: String, 
        enum: ['customer', 'admin'], 
        default: 'customer' },
    address: { 
        street: String, 
        city: String, 
        state: String, 
        zip: String 
    },
    purchaseCount: { 
        type: Number, 
        default: 0
    },
    createdAt: { 
        type: Date, 
        default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
