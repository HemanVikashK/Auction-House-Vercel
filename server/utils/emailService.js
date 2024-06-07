const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: "khemanvikash@gmail.com",
    pass: "vik&rajan1",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "khemanvikash@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmail;
