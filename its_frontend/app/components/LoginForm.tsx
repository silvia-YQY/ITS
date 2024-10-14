"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Form, Input, Button, message } from "antd";
import { login } from "@/api/authService";
import { UserLoginDto } from "@/interface/use";

const Login = ({ setUser }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onFinish = async (values: UserLoginDto) => {
    // Handle login logic here
    try {
      const user = await login(values);

      const userData = {
        username: user.user.username,
        email: user.user.email,
        isAdmin: user.user.isAdmin,
        token: user.token,
      };

      setUser(userData);

      // Store user information in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      // Store the token in localStorage
      localStorage.setItem("token", user.token);

      router.push("/order");
    } catch (error) {
      console.log("login33", error);

      messageApi.open({
        type: "error",
        content: "User email or Password wrong, please try again.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
