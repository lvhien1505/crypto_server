const { body, validationResult, check } = require('express-validator');
const apiResponse = require('../helpers/apiResponse');

exports.validatorRegister = [
    body('fullName')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Full name must be specified.')
        .escape()
        .custom((value) => {
            let match = value.match(/^[A-Za-z ]+$/);
            if (!match) {
                return Promise.reject('Full name non-alphanumeric characters.');
            } else {
                return match;
            }
        }),
    body('phone')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Phone must be specified.')
        .isAlphanumeric()
        .withMessage('Phone has non-alphanumeric characters.')
        .escape(),
    body('email')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Email must be specified.')
        .isEmail()
        .withMessage('Email must be a valid email address.')
        .escape(),
    body('password')
        .isLength({ min: 6 })
        .trim()
        .withMessage('Password must be 6 characters or greater.')
        .escape(),
];

exports.validatorLogin = [
    body('email')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Email must be specified.')
        .isEmail()
        .withMessage('Email must be a valid email address.')
        .escape(),

    body('password')
        .isLength({ min: 6 })
        .trim()
        .withMessage('Password must be 6 characters or greater.')
        .escape(),
];

exports.validationResult = (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            let msg = errors.array()[0].msg;
            // Display sanitized values/errors messages.
            return apiResponse.validationErrorWithData(res, msg);
        }
        next();
    } catch (error) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, err);
    }
};
