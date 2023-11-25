const express = require("express")
const register = require("../controllers/auth")
const { check } = require('express-validator');

const Routers = express.Router()

Routers.route("/register").post([
    check('email', 'Please include a valid email').isEmail(),
  ],register.register)
Routers.route("/login").post(register.login)
Routers.route("/restLink/:id/:token").post(register.restLink).get(register.getrestlink)
Routers.route("/loginemailsand").post(register.loginEmailSand)
Routers.route("/signupemailsand").post(register.signupEmailSand)
Routers.route("/verifyotp/:id").post(register.verifySuccessful)
Routers.route("/resetotp/:id").post(register.resendotp)
Routers.route("/forgotpassword").post(register.forgotPassword)
Routers.route("/tradingsession/:id").get(register.tradingSession)
Routers.route("/sendpayment/:id").post(register.sendPaymentInfo)

module.exports = Routers
