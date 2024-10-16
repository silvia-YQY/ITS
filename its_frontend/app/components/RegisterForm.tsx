"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Form, Input, Button, Switch, Radio, message } from "antd";
import { login, register } from "@/api/authService";
import { UserRegisterDto } from "@/interface/use";

const Register = ({ setUser }) => {
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UserRegisterDto) => {
    console.log("UserRegisterDto", values);
    try {
      // Handle registration logic here
      await register({
        ...values,
      });

      messageApi.open({
        type: "success",
        content: `Registered. Please Login.`,
      });

      // const user = await login({
      //   email: values.email,
      //   password: values.password,
      // });

      // setUser({
      //   username: user.user.username,
      //   email: user.user.email,
      //   isAdmin: user.user.isAdmin,
      //   token: user.token,
      // });
      router.push("/login");
    } catch (error) {
      console.log("errors", error);

      messageApi.open({
        type: "error",
        content: `${error.response.data}, please try again.`,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
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
        <Form.Item label="Radio" name="isAdmin">
          <Radio.Group>
            {/* <Radio defaultChecked={false} value="admin">
              Admin
            </Radio> */}
            <Radio defaultChecked value="user">
              User
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
