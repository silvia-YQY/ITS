"use client";
import "../app/globals.css";
import { Layout, theme } from "antd";
import MenuComponent from "@/app/components/Menu";
import React, { useEffect, useState } from "react";
import LoginModel from "./components/LoginModel";
import { User } from "@/interface/use";

const { Content, Footer, Sider } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(); // User state to track if user is logged in

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser); // Converts it back to an object
      setUser(user);
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          {!user ? (
            <>
              <LoginModel setUser={setUser} />
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
                <MenuComponent user={user} />
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
