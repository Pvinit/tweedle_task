let jwt = require("jsonwebtoken");
let config = require("./config")();
//======== Require mongodb schema ========//
let user = require('../api/models/userModel');



module.exports.authenticate = function (req, res, next) {
    // GEt authorication token from header
    let token = req.headers.authtoken;
    if (token) { // if token exist then verify the token and authenticate 
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                return res.send({
                    responseCode: 403,
                    responseMessage: "Failed to authenticate token."
                });

            }
            else {
                req.decoded = decoded;

                console.log('/------decoded token--------/');
                console.log(req.decoded);

                let query = user.findById(req.decoded._id);;
                query.exec((err, successData) => {
                    if (err) {
                        return res.send({ // server error if any error occured at query time
                            responseCode: 500,
                            responseMessage: "Server Error."
                        });
                    }
                    else if (!successData) {

                        return res.send({ // data not found if account not exist in db by given id
                            responseCode: 403,
                            responseMessage: "Invalid auth token"
                        });
                    }
                    else {
                        // console.log("decode success",successData)
                        if (successData.status == 'ACTIVE') { // process next() function if user active
                            next();
                        }
                        else {
                            console.log('Something went wrong'); // if status not match between active or pending
                            return res.send({
                                responseCode: 403,
                                responseMessage: "Account not active || Something went wrong"
                            });
                        }
                    }
                })
            }
        });
    }
    else { // if token not exist then return to client token not provided
        console.log("token not exist".red)
        return res.send({
            responseCode: 403,
            responseMessage: "no token provided"
        });
    }
}