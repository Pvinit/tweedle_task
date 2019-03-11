
// Require the package ============

let express = require("express");
let router = express.Router();

// Require the global functions ============

let auth = require("../../globalFunctions/auth");

//======= Require validation.js
let validate = require("../../middleWares/validation");

// get all api ======

let userApi = require("../controllers/userController");


const {
    validationResult
} = require("express-validator/check");


// apply the routes to our application with the prefix /api
router.post("/signUp", validate.singUpRequest, (req, res, next) => {
    try {
        validationResult(req).throw();
        next();
    } catch (err) {
        console.log(err)
        res.send({
            responseCode: 422,
            responseMessage: "Some request missing"
        });
    }
}, userApi.signUp);

router.post("/login", validate.verifyRequest, (req, res, next) => {
    try {
        validationResult(req).throw();
        next();
    } catch (err) {
        res.send({
            responseCode: 422,
            responseMessage: "Some request missing"
        });
    }
}, userApi.login);

router.post("/updateUserDetails", auth.authenticate, userApi.updateUserDetails);
router.delete("/deleteUser", auth.authenticate, userApi.deleteUser);

module.exports = router;