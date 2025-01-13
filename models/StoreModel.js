const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true },
    location: { 
        street: String, 
        city: String, 
        state: String, 
        zip: String 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin user
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);
