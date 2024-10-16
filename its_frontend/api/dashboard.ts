import axiosInstance from "@/lib/axiosInstance";
import {
  TotalCarsParkedResponse,
  TotalRevenueResponse,
  TotalPendingOrdersResponse,
  RevenueByDateResponse,
  OrderStatisticsResponse,
} from "@/interface/dashboard";
import { Order } from "@/interface/order";

// Fetch total cars parked
export const fetchTotalCarsParked = async (): Promise<number> => {
  const res = await axiosInstance.get("/api/Dashboard/totalCarsParked");
  return res.data;
};

// Fetch total revenue
export const fetchTotalRevenue = async (): Promise<number> => {
  const res = await axiosInstance.get("/api/Dashboard/totalRevenue");
  return res.data;
};

// Fetch total pending orders
export const fetchTotalPendingOrders = async (): Promise<Order[]> => {
  const res = await axiosInstance.get("/api/Dashboard/totalPendingOrder");
  return res.data;
};

// Fetch revenue by date range
export const fetchRevenueByDate = async (
  startDate: string,
  endDate: string
): Promise<RevenueByDateResponse[]> => {
  const res = await axiosInstance.get(`/api/Dashboard/revenueByDate`, {
    params: { startDate, endDate },
  });
  return res.data;
};

// Fetch order statistics (completed, pending, canceled)
export const fetchOrderStatistics =
  async (): Promise<OrderStatisticsResponse> => {
    const res = await axiosInstance.get("/api/Dashboard/GetOrderStatistics");
    return res.data;
  };
