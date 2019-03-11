const { check, oneOf, validationResult } = require('express-validator/check');

module.exports = {
  singUpRequest: [
    check('phoneNumber').not().isIn(['', null, ""])
    , check('name').exists()
    , check('emailId').isEmail()
    , check('password').isLength({ min: 6 })
  ]
  , verifyRequest: [
    check('emailId').isEmail()
    , check('password').isLength({ min: 6 })
  ]
}


