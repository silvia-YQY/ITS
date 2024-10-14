"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCarsByPage, addCar, updateCar, deleteCar } from "@/api/car";
import { CarDto } from "@/interface/car";
import { User } from "@/interface/use";
import UploadCarPlate from "../components/uploadCarPlate";

const CarTable: React.FC = () => {
  const [cars, setCars] = useState<CarDto[]>([]);
  const [car, setCar] = useState<CarDto>();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCar, setEditingCar] = useState<CarDto | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch cars with pagination
  const fetchCars = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getCarsByPage(page, pageSize);
      setCars(response.items);
      setTotal(response.totalCount);
    } catch (error) {
      message.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars(page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    fetchCars(page, pageSize);
  }, [car]);

  // Delete car
  const handleDelete = async (id: number) => {
    try {
      await deleteCar(id);
      message.success("Car deleted successfully");
      fetchCars(page, pageSize);
    } catch (error) {
      message.error("Failed to delete car");
    }
  };

  // Columns for table
  const columns: ColumnsType<CarDto> = [
    {
      title: "Car Plate",
      dataIndex: "carPlate",
      key: "carPlate",
    },
    // {
    //   title: "User Name",
    //   key: "userName",
    //   render: (_, record: CarDto) => {
    //     return record.user?.username;
    //   },
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text, record: CarDto) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingCar(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this car?"
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

  // Pagination configuration
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      {/* <Button
        type="primary"
        onClick={() => {
          setEditingCar(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Car
      </Button> */}
      <UploadCarPlate setCar={setCar} />

      <Table
        columns={columns}
        dataSource={cars}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default CarTable;
