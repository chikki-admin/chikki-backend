const nodemailer = require('nodemailer');
const { AppConfig } = require('./configs');
const { backendUri } = require('./database-connector');

// Create a transporter object with SMTP options
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: 'chikkiaquatics@gmail.com',
      pass: AppConfig.ChikkiEmailPassword
    }
  });

// Define the email message
const message = (recepientEmail, verificationLink) => {
    return {
        from: 'chikkiaquatics@gmail.com',
        to: recepientEmail,
        subject: 'Confirmation Email',
        html: `Click <a href="${backendUri}/email/verify/${verificationLink}"> Verify link here</a> to confirm your email.`
    }
};

const sendEmail = (recepientEmail, verificationLink) => {
    const createMessage = message(recepientEmail, verificationLink)

    // Send the email
    transporter.sendMail(createMessage, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    })};

module.exports = { sendEmail }