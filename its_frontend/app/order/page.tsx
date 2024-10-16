"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getOrdersByPage,
  addOrder,
  updateOrder,
  deleteOrder,
} from "@/api/order";
import moment from "moment";
import { OrderDto } from "@/interface/order";

const { Option } = Select;

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderDto | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch orders with pagination
  const fetchOrders = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getOrdersByPage(page, pageSize);
      setOrders(response.items);
      setTotal(response.TotalCount);
    } catch (error) {
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  // Add or update order
  const handleSubmit = async (values: Partial<OrderDto>) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, values);
        message.success("Order updated successfully");
      } else {
        await addOrder(values);
        message.success("Order added successfully");
      }
      fetchOrders(page, pageSize);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save order");
    }
  };

  // Delete order
  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      message.success("Order deleted successfully");
      fetchOrders(page, pageSize);
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  const handleEdit = (record: OrderDto) => {
    setEditingOrder(record);
    form.setFieldsValue({
      ...record,
      startTime: moment(record.startTime),
      endTime: moment(record.endTime),
    });
    setIsModalVisible(true);
  };

  // Define columns for the table
  const columns: ColumnsType<OrderDto> = [
    {
      title: "Car ID",
      dataIndex: "carId",
      key: "carId",
    },
    {
      title: "User Name",
      key: "userName",
      render: (_, record: OrderDto) => {
        return record.userName;
      },
    },
    {
      title: "Car Plate",
      key: "carPlate",
      render: (_, record: OrderDto) => {
        return record.carPlate;
      },
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: string) =>
        moment(startTime).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime: string) =>
        endTime ? moment(endTime).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      render: (fee: number) => fee.toFixed(2),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: number) => {
        switch (status) {
          case 0:
            return <Tag color="blue">Confirm</Tag>;
          case 1:
            return <Tag color="orange">Pending</Tag>;
          case 2:
            return <Tag color="green">Done</Tag>;
          case 3:
            return <Tag color="red">Cancel</Tag>;
          default:
            break;
        }
        return status;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this order?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={orders}
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
        title={editingOrder ? "Edit Order" : "Add Order"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Car ID"
            name="carId"
            rules={[{ required: true, message: "Please enter the car ID" }]}
          >
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: "Please enter the user ID" }]}
          >
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[
              { required: true, message: "Please select the start time" },
            ]}
          >
            <DatePicker disabled showTime />
          </Form.Item>
          <Form.Item label="End Time" name="endTime">
            <DatePicker disabled showTime />
          </Form.Item>
          <Form.Item
            label="Fee"
            name="fee"
            rules={[{ required: true, message: "Please enter the fee" }]}
          >
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item label="Order Status" name="orderStatus">
            <Select>
              <Option value={0}>Confirm</Option>
              <Option value={1}>Pending</Option>
              <Option value={2}>Done</Option>
              <Option value={3}>Cancel</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderTable;
