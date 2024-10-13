import axiosInstance from "@/lib/axiosInstance";
import {
  TotalCarsParkedResponse,
  TotalRevenueResponse,
  TotalPendingOrdersResponse,
  RevenueByDateResponse,
  OrderStatisticsResponse,
  TopUsersResponse,
} from "@/interface/dashboard";

// Fetch total cars parked
export const fetchTotalCarsParked = (): Promise<TotalCarsParkedResponse> => {
  return axiosInstance.get("/api/Dashboard/totalCarsParked");
};

// Fetch total revenue
export const fetchTotalRevenue = (): Promise<TotalRevenueResponse> => {
  return axiosInstance.get("/api/Dashboard/totalRevenue");
};

// Fetch total pending orders
export const fetchTotalPendingOrders =
  (): Promise<TotalPendingOrdersResponse> => {
    return axiosInstance.get("/api/Dashboard/totalPendingOrder");
  };

// Fetch revenue by date range
export const fetchRevenueByDate = (
  startDate: string,
  endDate: string
): Promise<RevenueByDateResponse[]> => {
  return axiosInstance.get(`/api/Dashboard/revenueByDate`, {
    params: { startDate, endDate },
  });
};

// Fetch order statistics (completed, pending, canceled)
export const fetchOrderStatistics = (): Promise<OrderStatisticsResponse> => {
  return axiosInstance.get("/api/Dashboard/GetOrderStatistics");
};
