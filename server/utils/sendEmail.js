const nodeMailer = require("nodemailer");

module.exports = async ({ to, subject, html }) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: "During Team",
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
