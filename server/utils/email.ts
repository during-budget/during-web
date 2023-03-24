import nodeMailer from "nodemailer";

export const sendEmail = async (props: {
  to: string;
  subject: string;
  html: string;
}) => {
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
    to: props.to,
    subject: props.subject,
    html: props.html,
  };
  await transporter.sendMail(mailOptions);
};
