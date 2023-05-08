import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import useStore from "../../hooks/useStore";
import { useState } from "react";
import useAPI from "../../hooks/useAPI";

import {
  GoogleLoginButton,
  NaverLoginButton,
  KakaoLoginButton,
} from "../../components/SocialLoginButton";

const Index = () => {
  const { logIn } = useStore((state) => state);
  const API = useAPI();

  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const form1 = (
    <Form
      name="normal_login"
      className="login-form"
      onFinish={async (values) => {
        try {
          await API.POST({
            location: "users/login/local",
            data: { email: values.email.trim(), auth: "admin" },
          });
          setSent(true);
          setEmail(values.email);
        } catch (err) {
          alert(
            err.response.data?.message ? err.response.data?.message : "ERROR!"
          );
          console.error(err);
        }
      }}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="email"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Send verification code
        </Button>
      </Form.Item>
    </Form>
  );

  const form2 = (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        email: email,
        remember: true,
      }}
      onFinish={async (values) => {
        try {
          const { user } = await API.POST({
            location: "users/login/local/verify",
            data: {
              email: values.email.trim(),
              code: values.code.trim(),
              persist: values.remember,
            },
          });
          logIn({ _id: user._id, email: user.email });
        } catch (err) {
          alert(
            err.response.data?.message ? err.response.data?.message : "ERROR!"
          );
          console.error(err);
        }
      }}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="email"
          disabled
        />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[
          {
            required: true,
            message: "Please input your verification code!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="code"
          placeholder="verification code"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ marginTop: "48px" }}>
      <h1>Welcome to Admin Page!</h1>
      <div style={{ marginTop: "24px" }} />
      {!sent ? form1 : form2}
      <div
        style={{
          margin: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <a href="http://localhost:5555/api/auth/google">
          <GoogleLoginButton />
        </a>
        <a href="http://localhost:5555/api/auth/naver">
          <NaverLoginButton />
        </a>
        <a href="http://localhost:5555/api/auth/kakao">
          <KakaoLoginButton />
        </a>
      </div>
    </div>
  );
};
export default Index;
