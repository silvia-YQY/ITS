"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { MenuProps, MenuTheme } from "antd";
import { Menu } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];

const MenuComponent = ({ user, setUser }) => {
  const router = useRouter();

  const [current, setCurrent] = useState("1");

  const items: MenuItem[] = [
    {
      key: "user",
      label: "User",
      icon: <MailOutlined />,
    },
    {
      key: "car",
      label: "Car",
      icon: <AppstoreOutlined />,
    },
    {
      key: "order",
      label: "Order",
      icon: <SettingOutlined />,
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  ];

  const handleMenuClick = ({ key }) => {
    router.push(`/${key}`);
  };

  return (
    <Menu
      onClick={handleMenuClick}
      theme="dark"
      defaultSelectedKeys={["1"]}
      mode="inline"
      items={items}
    />
  );
};

export default MenuComponent;
