import axiosInstance from "@/lib/axiosInstance";
import { Order, OrderDto, OrderDtoPagedResultDto } from "./types";
import { CarDto } from "@/interface/car";

export const fetchOrders = (): Promise<Order[]> =>
  axiosInstance.get("/api/Order");

export const fetchOrderById = (id: number): Promise<Order> =>
  axiosInstance.get(`/api/Order/${id}`);

export const getOrdersByPage = async (page: number, pageSize: number) => {
  const response = await axiosInstance.get(`/api/Order/userOrders`, {
    params: { page, pageSize },
  });
  return response.data as OrderDtoPagedResultDto;
};

export const addOrder = async (order: Partial<OrderDto>) => {
  return axiosInstance.post("/api/Order", order);
};

export const updateOrder = async (id: number, order: Partial<OrderDto>) => {
  return axiosInstance.put(`/api/Order/${id}`, order);
};

export const deleteOrder = async (id: number) => {
  return axiosInstance.delete(`/api/Order/${id}`);
};

export const loginOrder = async (car: Partial<CarDto>) => {
  return axiosInstance.post("/api/Car/loginOrder", car);
};
