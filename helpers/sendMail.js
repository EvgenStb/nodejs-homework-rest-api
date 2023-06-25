const nodemailer = require("nodemailer");
require("dotenv").config();


const {LOGIN_UKRNET, PASSWORD_UKRNET} = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: LOGIN_UKRNET,
    pass: PASSWORD_UKRNET
  }
});

const email = {
    to: "evgenstb@gmail.com",
    from: LOGIN_UKRNET,
    sbuject: "test email from nodemailer",
    html: "TEST"
}
const sendEmail = async (data) => {
  const email = {...data, from: LOGIN_UKRNET}
  await transporter.sendMail(email);
  return true
}

module.exports = sendEmail; 

