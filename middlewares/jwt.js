const jwt = require('express-jwt');
const secret = process.env.JWT_SECRET;
const apiResponse = require('../helpers/apiResponse');

const authenticate = [
    jwt({
        secret: secret,
        algorithms: ['HS256'],
        getToken: function fromHeaderOrQuerystring(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(' ')[0] === 'Bearer'
            ) {
                return req.headers.authorization.split(' ')[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
    }),
    function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            return apiResponse.unauthorizedResponse(res, 'Permission denied !');
        }
        next();
    },
];

module.exports = authenticate;
