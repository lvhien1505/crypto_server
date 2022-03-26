const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const apiResponse = require('../helpers/apiResponse');

exports.register = async (req, res) => {
    try {
        const foundUser = await UserModel.findOne({
            email: req.body.email,
        }).lean();

        if (foundUser) {
            return apiResponse.conflicResponse(res, 'Email is exist');
        }

        //hash input password
        const hash = await bcrypt.hash(req.body.password, 10);
        if (hash) {
            // Create User object with escaped and trimmed data
            const user = await UserModel.create({
                fullName: req.body.fullName,
                phone: req.body.phone,
                email: req.body.email,
                password: hash,
            });

            if (user) {
                return apiResponse.successResponseWithData(
                    res,
                    'Registration Success.',
                    user
                );
            }
        }
    } catch (error) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email }).lean();

        if (user) {
            const compare = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (compare) {
                let userData = {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role:user.role
                };
                //Prepare JWT token for authentication
                const jwtPayload = userData;
                const jwtData = {
                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                };
                const secret = process.env.JWT_SECRET;
                //Generated JWT token with Payload and secret.
                userData.token = jwt.sign(jwtPayload, secret, jwtData);
                return apiResponse.successResponseWithData(
                    res,
                    'Login Success.',
                    userData
                );
            } else {
                return apiResponse.unauthorizedResponse(
                    res,
                    'Email or Password wrong.'
                );
            }
        } else {
            return apiResponse.unauthorizedResponse(
                res,
                'Email or Password wrong.'
            );
        }
    } catch (error) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.authSimplified = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email }).lean();

        delete req.user.iat;
        delete req.user.exp;
        if (!user.status) {
            return apiResponse.unauthorizedResponse(
                res,
                'Account is not active. Please contact admin.',
                'notActive',
                req.user
            );
        }
        return apiResponse.successResponseWithData(
            res,
            'Authenticate success.',
            req.user
        );
    } catch (error) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.authFull = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email }).lean();

        delete req.user.iat;
        delete req.user.exp;
        if (!user.isConfirmed) {
            return apiResponse.unauthorizedResponse(
                res,
                'Account is not confirmed. Please confirm your account.',
                'notConfirm',
                req.user
            );
        }
        if (!user.status) {
            return apiResponse.unauthorizedResponse(
                res,
                'Account is not active. Please contact admin.',
                'notActive',
                req.user
            );
        }
        return apiResponse.successResponseWithData(
            res,
            'Authenticate success.',
            req.user
        );
    } catch (error) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, error);
    }
};

