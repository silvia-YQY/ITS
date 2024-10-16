"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getUsersByPage, addUser, updateUser, deleteUser } from "@/api/user";
import { UserDto, UserRegisterDto } from "@/interface/use";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto>();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch users with pagination
  const fetchUsers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getUsersByPage(page, pageSize);
      setUsers(response.items);
      setTotal(response.totalCount);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize);
  }, [page, pageSize]);

  // Add or update user
  const handleSubmit = async (values: Partial<UserRegisterDto>) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success("User updated successfully");
      } else {
        await addUser({ ...values, role: "user" });
        message.success("User added successfully");
      }
      fetchUsers(page, pageSize);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save user");
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("User deleted successfully");
      fetchUsers(page, pageSize);
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleEdit = (record: UserDto) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
    });
    setIsModalVisible(true);
  };

  // Define columns for the table
  const columns: ColumnsType<UserDto> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          {/* <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button> */}
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      {/* <Button
        type="primary"
        onClick={() => {
          setEditingUser(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ margin: 16 }}
      >
        Add User
      </Button> */}

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter the username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter a valid email" }]}
          >
            <Input disabled={editingUser ? true : false} type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a Password" }]}
          >
            <Input.Password type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTable;
