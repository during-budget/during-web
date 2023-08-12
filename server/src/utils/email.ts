import nodeMailer from "nodemailer";
import { generateRandomNumber } from "./randomString";
import ejs from "ejs";
import { resolve } from "path";

const sendEmail = async (props: {
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
    from: `During <${process.env.NODEMAILER_USER}>`,
    to: props.to,
    subject: props.subject,
    html: props.html,
  };
  await transporter.sendMail(mailOptions);
};

const authTypeText: {
  login: string;
  register: string;
  updateEmail: string;
} = {
  login: "로그인",
  register: "회원 가입",
  updateEmail: "이메일 변경",
};

export const sendAuthEmail = async (props: {
  email: string;
  type: "login" | "register" | "updateEmail";
}) => {
  const code = generateRandomNumber(6);

  const html = await ejs.renderFile(
    resolve(__dirname, "./emailTemplates/authEmail.ejs"),
    {
      type: authTypeText[props.type],
      code,
    }
  );

  await sendEmail({
    to: props.email,
    subject: `${authTypeText[props.type]} 인증 메일입니다.`,
    html,
  });

  return code;
};
