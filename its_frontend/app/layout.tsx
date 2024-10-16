"use client";
import "../app/globals.css";
import { Avatar, Badge, Flex, Layout, Popconfirm } from "antd";
import MenuComponent from "@/app/components/Menu";
import React, { useEffect, useState } from "react";
import LoginModel from "./components/LoginModel";
import { User } from "@/interface/use";
import { useRouter } from "next/navigation";

const { Header, Content, Footer, Sider } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(); // User state to track if user is logged in
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

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
            <Layout>
              <Header>
                <Flex gap="middle" align="flex-end" justify="flex-end">
                  <a>
                    <Popconfirm
                      title="Do you want to log out?"
                      onConfirm={handleLogout}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Avatar style={{ backgroundColor: "#f56a00" }}>
                        <div>{user?.username}</div>
                      </Avatar>
                    </Popconfirm>
                  </a>
                </Flex>
              </Header>
              <Layout>
                <Sider
                  collapsible={false} // 禁用折叠
                  collapsed={collapsed}
                  onCollapse={(value) => setCollapsed(value)}
                >
                  <div className="demo-logo-vertical" />
                  <MenuComponent user={user} />
                </Sider>
                <Layout style={{ display: "flex", flexDirection: "column" }}>
                  {/* 使用 flex 来确保内容和 footer 正确布局 */}
                  <Content style={{ flex: 1, margin: "0 20px" }}>
                    <div>{children}</div>
                  </Content>
                  <Footer style={{ textAlign: "center" }}>
                    Car Parking System ©2024
                  </Footer>
                </Layout>
              </Layout>
            </Layout>
          )}
        </Layout>
      </body>
    </html>
  );
}
