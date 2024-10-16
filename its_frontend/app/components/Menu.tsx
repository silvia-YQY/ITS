"use client";

import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { User } from "@/interface/use";
type MenuItem = Required<MenuProps>["items"][number];

const MenuComponent = ({ user }: { user: User }) => {
  const router = useRouter();

  const userItems: MenuItem[] = [
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
  ];

  const adminItems: MenuItem[] = [
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
      defaultOpenKeys={["order"]}
      mode="inline"
      items={user?.isAdmin ? adminItems : userItems}
    />
  );
};

export default MenuComponent;
