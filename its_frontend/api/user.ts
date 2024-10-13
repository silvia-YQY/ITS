// services/api.ts

import { UserDto, UserDtoPagedResultDto } from "@/interface/use";
import axiosInstance from "@/lib/axiosInstance";

export const getUsersByPage = async (page: number, pageSize: number) => {
  try {
    const response = await axiosInstance.get(`/api/User/allByPage`, {
      params: { page, pageSize },
    });
    return response.data as UserDtoPagedResultDto;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};

// Create New Order
export const addUser = async (user: UserDto) => {
  try {
    return axiosInstance.post("/api/User", user);
  } catch (error) {
    console.error("Error Creating order:", error);
    throw error;
  }
};

export const updateUser = async (id: number, user: UserDto) => {
  try {
    return axiosInstance.put(`/api/User/${id}`, user);
  } catch (error) {
    console.error("Error Creating order:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    return axiosInstance.delete(`/api/User/${id}`);
  } catch (error) {
    console.error("Error Creating order:", error);
    throw error;
  }
};
