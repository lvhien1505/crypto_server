const express = require('express');
const AuthController = require('../controllers/AuthController');
const {
    validationResult,
    validatorLogin,
    validatorRegister,
} = require('../middlewares/validator');
const authenticate = require('../middlewares/jwt');

const router = express.Router();

router.post('/', authenticate, AuthController.authSimplified);
router.post('/full', authenticate, AuthController.authFull);
router.post(
    '/register',
    validatorRegister,
    validationResult,
    AuthController.register
);
router.post('/login', validatorLogin, validationResult, AuthController.login);

// router.post("/verify-otp", AuthController.verifyConfirm);
// router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

module.exports = router;
