'use strict';

// user schema definition (Active)

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    userSchema = new Schema({

        name: {
            type: String,
            trim: true
        },
        phoneNumber: {
            type: String,
             unique: true
        },
        emailId: {
            type: String,
            lowerCase: true,
            trim: true,
            unique: true
        },

        password: {
            type: String
        },
        gender: {
            type: String  // Male , Female
        },
        status: {
            type: String
            , default: 'ACTIVE', uppercase: true
        }
    }, {
            timestamps: true
        });
module.exports = mongoose.model('user', userSchema, 'users');

