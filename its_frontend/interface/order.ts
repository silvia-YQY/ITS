import { Car } from "./car";
import { User } from "./use";

export enum OrderStatus {
  Confirm = 0,
  Done = 1,
  Cancel = 2,
  Pending = 3,
}

export interface OrderStatusUpdateDto {
  OrderStatus: OrderStatus;
}

export interface Order {
  id: number;
  carId: number;
  car?: Car;
  userId: number;
  user?: User;
  startTime: string; // ISO string for datetime
  endTime?: string;
  fee: number;
  orderStatus: OrderStatus;
}

export interface OrderDto {
  id: number;
  carId: number;
  userId: number;
  startTime: string;
  endTime?: string;
  fee: number;
  orderStatus: OrderStatus;
  carPlate?: string;
  userName?: string;
}

export interface OrderDtoPagedResultDto {
  items: OrderDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
