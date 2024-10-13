"use client";
import "../app/globals.css";
import { Layout, Modal, Button, theme } from "antd";
import Login from "@/app/components/LoginForm";
import Register from "@/app/components/RegisterForm";
import MenuComponent from "@/app/components/Menu";
import React, { useState } from "react";

const { Header, Content, Footer, Sider } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(true); // User state to track if user is logged in
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between login and register

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          {!user ? (
            <>
              {/* Modal to switch between Login and Register */}
              <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
                title={isLoginView ? "Login" : "Register"}
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
                      Don't have an account?{" "}
                      <Button type="link" onClick={showRegister}>
                        Register here
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Button type="link" onClick={showLogin}>
                        Login here
                      </Button>
                    </>
                  )}
                </div>
              </Modal>
            </>
          ) : (
            <Layout style={{ minHeight: "100vh" }}>
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
              >
                <div className="demo-logo-vertical" />
                {/* Menu and Main content displayed when the user is logged in */}
                <MenuComponent user={user} setUser={setUser} />
              </Sider>
              <Layout>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: "0 16px" }}>
                  <div
                    style={{
                      padding: 24,
                      minHeight: 360,
                      background: colorBgContainer,
                      borderRadius: borderRadiusLG,
                    }}
                  >
                    {children}
                  </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                  Car Parking System ©2024
                </Footer>
              </Layout>
            </Layout>
          )}
          {/* Footer */}
        </Layout>
      </body>
    </html>
  );
}
