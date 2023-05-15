'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        uppercase: true
    },
    cart:[
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, required: true },
        },
      ],
});

module.exports = mongoose.model('User',userSchema);
