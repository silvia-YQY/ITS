"use client";

import { Button, Modal } from "antd";
import Login from "./LoginForm";
import React, { useEffect, useState } from "react";
import Register from "./RegisterForm";

const LoginModel = ({ setUser }) => {
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and register

  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state
  const [isMounted, setIsMounted] = useState(false);

  // This will trigger only on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showLogin = () => {
    setIsLoginView(true);
    setIsModalVisible(true);
  };

  const showRegister = () => {
    setIsLoginView(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!isMounted) return null;
  return (
    <div
      style={{
        backgroundImage: "url('/images/1.webp')", // 背景图片路径
        backgroundSize: "cover", // 让图片覆盖整个背景
        backgroundPosition: "center", // 图片居中显示
        height: "100vh", // 背景图全屏
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        title={isLoginView ? "Login" : "Register"}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // 设置遮罩层透明度
      >
        {isLoginView ? (
          <Login setUser={setUser} />
        ) : (
          <Register setUser={setUser} />
        )}
        {/* Toggle between Login and Register */}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {isLoginView ? (
            <>
              Don't have an account?
              <Button type="link" onClick={showRegister}>
                Register here
              </Button>
            </>
          ) : (
            <>
              Already have an account?
              <Button type="link" onClick={showLogin}>
                Login here
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LoginModel;
