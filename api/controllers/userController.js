// Require the package ============

var jwt = require("jsonwebtoken");
var waterfall = require("async-waterfall");

// Require all functions  ============

var securityHandler = require("../../globalFunctions/encryptDescrypt");
var config = require("../../globalFunctions/config")();

// Require all MiddleWare  ============
var apiResponseHandler = require("../../middleWares/responseHandler");


// Require all mongodb schema==========

var user = require("../models/userModel");

const mongoose = require("mongoose");


var userApi = {

    "signUp": (req, res) => {
        try {
            var condition = {
                $and: [{
                    "status": "ACTIVE"
                }, {
                    $or: [{
                        phoneNumber: req.body.phoneNumber
                    }, {
                        emailId: req.body.emailId
                    }]
                }]
            };
            waterfall([
                (callback) => {
                    user.findOne(condition, (err, successData) => {
                        if (err) {
                            callback(err, null);
                        }
                        else if (successData) {
                            apiResponseHandler.responseWithOutData(res, 400, "User already exist.");
                        }
                        else {
                            callback();
                        }
                    });
                }
                , (callback) => {
                    req.body.password = securityHandler.encrypt(req.body.password);
                    var saveUserDetail = new user(req.body);
                    saveUserDetail.save((err, success) => {
                        if (err) callback(err, null);
                        else callback(null, success);
                    });
                }
            ], (err, success) => {
                if (err) { // error then
                    return apiResponseHandler.responseWithOutData(res, 500, "Server Error.");
                } else {
                    apiResponseHandler.responseWithObjectData(res, 200, "User registered successfully.", success);
                }
            });
        }
        catch (e) {
            console.log("error----addUser | POST" + e);
            apiResponseHandler.responseWithOutData(res, 500, "Something went wrong ");
        }
    },
    "login": (req, res) => {
        try {
            let query = user.findOne({
                emailId: req.body.emailId,
                status: "ACTIVE"
            });
            // find data bases of phone Number from user collections
            query.exec((err, userData) => {
                if (err) { // error then
                    return apiResponseHandler.responseWithOutData(res, 500, "Server Error.");
                }
                else if (!userData) { // if data not found then
                    return apiResponseHandler.responseWithOutData(res, 404, "Something went wrong");
                }
                else {
                    let decryptPassword = securityHandler.decrypt(userData.password)
                    let leanObject = {};
                    if (decryptPassword == req.body.password) {
                        console.log(userData, decryptPassword, req.body.password)
                        var authToken = jwt.sign({
                            _id: userData._id
                            , phoneNumber: userData.phoneNumber
                            , emailId: userData.emailId
                            , status: userData.status
                        }, config.secretKey);


                        leanObject["authtoken"] = authToken;
                        leanObject["userData"] = userData;

                        apiResponseHandler.responseTokenWithObjectdata(res, 200, "login successfully", leanObject);
                    }
                    else {
                        return apiResponseHandler.responseWithOutData(res, 404, "Please enter correct password");
                    }
                }
            });
        }
        catch (e) {
            apiResponseHandler.responseWithOutData(res, 500, "Something went wrong ");
        }
    },
    "updateUserDetails": (req, res) => {
        console.log(req.body);
        try {
            req.body['password'] = securityHandler.encrypt(req.body.password);
            let query = user.findOneAndUpdate(req.decoded._id, req.body, {
                new: true
            });

            query.exec((err, success) => {
                if (err) {
                    return apiResponseHandler.responseWithOutData(res, 500, "Server Error.");
                }
                else if (success) {
                    apiResponseHandler.responseWithOutData(res, 200, "user detail updated.");
                }
                else {
                    apiResponseHandler.responseWithOutData(res, 400, "Something went wrong");
                }
            });
        }
        catch (e) {
            console.log("error occured", e);
            apiResponseHandler.responseWithOutData(res, 500, "Something went wrong ");
        }
    },
    "deleteUser": (req, res) => {
        try {
            let query = user.findByIdAndDelete(req.decoded._id);

            query.exec((err, success) => {
                if (err) {
                    return apiResponseHandler.responseWithOutData(res, 500, "Server Error.");
                }
                else if (success) {
                    apiResponseHandler.responseWithOutData(res, 200, "user delete successfully");
                }
                else {
                    apiResponseHandler.responseWithOutData(res, 400, "Something went wrong");
                }
            });
        }
        catch (e) {
            console.log("error occured", e);
            apiResponseHandler.responseWithOutData(res, 500, "Something went wrong ");
        }
    }

};

module.exports = userApi;