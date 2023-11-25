const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config({path: '../config/index.env'})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SERVICE,
    port: 465,
    auth: {
      user: process.env.USER,
		  pass: process.env.EMAILPASS, 
    },
    secure: true
  });

module.exports = transporter;
