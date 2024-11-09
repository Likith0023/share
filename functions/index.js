const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'likith@pravaahconsulting.com',
    pass: 'njnh keqr qfna awgx', 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

exports.sendEmail = functions.https.onCall((data, context) => {
  const { toEmail, fileUrl } = data;

  if (!toEmail || !fileUrl) {
    return { success: false, error: 'Missing email address or file URL' };
  }

  const mailOptions = {
    from: 'likith@pravaahconsulting.com',
    to: toEmail,
    subject: 'File Download Link',
    text: `Here is your download link: ${fileUrl}`,
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log('Email sent to:', toEmail);
      return { success: true };
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    });
});
