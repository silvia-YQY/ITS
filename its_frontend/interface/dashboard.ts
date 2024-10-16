import { Order } from "./order";

export interface TotalCarsParkedResponse {
  totalCarsParked: number;
}

export interface TotalRevenueResponse {
  totalRevenue: number;
}

export interface TotalPendingOrdersResponse {
  totalPendingOrders: Order[];
}

export interface RevenueByDateResponse {
  date: string;
  revenue: number;
}

export interface OrderStatisticsResponse {
  completedOrders: number;
  pendingOrders: number;
  canceledOrders: number;
  totalOrders: number;
}

export interface TopUsersResponse {
  userId: number;
  username: string;
  totalOrders: number;
}
