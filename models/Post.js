const mongoose = require('mongoose');
const Category = require('./Category');

const postSchema = new mongoose.Schema({
    title:{
        type: 'string',
        required: true,
    },
    thumbnail:{
        type: 'string',
    },
    body:{
        type: 'string',
    },
    Category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
    createdAt: {
         type: Date,
         default: Date.now
         },
    updatedAt: { 
        type: Date, 
        default: Date.now
     }
})

module.exports = mongoose.model("Post", postSchema)